/**
 * Chatbot Widget Script
 * Embeddable AI chatbot widget for websites
 */

(function (window, document) {
  "use strict";

  // Widget Configuration
  const WIDGET_CONFIG = {
    apiUrl: null,
    supabaseUrl: null,
    sessionExpiry: 10 * 60 * 1000, // 10 minutes
    rateLimit: {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1 minute
    },
    retryAttempts: 3,
    retryDelay: 1000,
  };

  // Widget State
  let widgetState = {
    isInitialized: false,
    isOpen: false,
    agent: null,
    session: null,
    messages: [],
    isLoading: false,
    rateLimitRemaining: 30,
    reconnectAttempts: 0,
  };

  // WebSocket connection
  let websocket = null;
  let reconnectTimer = null;

  class ChatbotWidget {
    constructor() {
      this.container = null;
      this.elements = {};
      this.messageQueue = [];
      this.isProcessing = false;

      // Bind methods
      this.handleMessage = this.handleMessage.bind(this);
      this.handleWebSocketMessage = this.handleWebSocketMessage.bind(this);
      this.toggleWidget = this.toggleWidget.bind(this);
      this.sendMessage = this.sendMessage.bind(this);
    }

    // Initialize widget
    async init(config) {
      if (widgetState.isInitialized) {
        console.warn("ChatbotWidget already initialized");
        return;
      }

      try {
        // Validate required config
        if (!config.botId) {
          throw new Error("botId is required");
        }

        // Set configuration
        WIDGET_CONFIG.apiUrl =
          config.apiUrl ||
          `${window.location.protocol}//${window.location.host}/api/widget`;
        WIDGET_CONFIG.supabaseUrl = config.supabaseUrl;

        // Load agent configuration
        const agentResult = await this.callRPC("get_widget_agent", {
          public_key_param: config.botId,
        });

        if (!agentResult.success) {
          throw new Error(
            agentResult.error || "Failed to load agent configuration"
          );
        }

        widgetState.agent = agentResult.data;

        // Apply agent config to widget config
        Object.assign(config, {
          position:
            widgetState.agent.widget_position ||
            config.position ||
            "bottom-right",
          theme: widgetState.agent.widget_theme || config.theme || "light",
          autoOpen: widgetState.agent.auto_open || config.autoOpen || false,
          showBranding: widgetState.agent.show_branding !== false,
        });

        // Create widget UI
        this.createWidget(config);

        // Initialize session
        await this.initSession();

        // Load chat history
        await this.loadChatHistory();

        // Setup WebSocket connection
        this.setupWebSocket();

        // Auto-open if configured
        if (config.autoOpen) {
          setTimeout(() => this.openWidget(), 1000);
        }

        widgetState.isInitialized = true;
        console.log("ChatbotWidget initialized successfully");
      } catch (error) {
        console.error("Failed to initialize ChatbotWidget:", error);
        this.showError(
          "Failed to initialize chatbot. Please refresh the page and try again."
        );
      }
    }

    // Create widget UI
    createWidget(config) {
      // Create main container
      this.container = document.createElement("div");
      this.container.id = "chatbot-widget";
      this.container.className = `chatbot-widget ${config.position} ${config.theme}`;

      // Widget HTML structure
      this.container.innerHTML = `
        <div class="chatbot-trigger" id="chatbot-trigger">
          <div class="chatbot-trigger-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 15.01 3.06 16.31L1 23L7.69 20.94C8.99 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12S17.52 2 12 2ZM12 20C10.74 20 9.54 19.68 8.5 19.1L8.19 18.93L4.55 19.97L5.59 16.33L5.42 16.02C4.82 15.01 4.5 13.84 4.5 12.62C4.5 7.89 8.27 4.12 13 4.12S21.5 7.89 21.5 12.62C21.5 17.35 17.73 21.12 13 21.12L12 20Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="chatbot-trigger-close" style="display: none;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div class="chatbot-window" id="chatbot-window" style="display: none;">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21Z" fill="currentColor"/>
                </svg>
              </div>
              <div class="chatbot-info">
                <div class="chatbot-name">${
                  widgetState.agent?.name || "AI Assistant"
                }</div>
                <div class="chatbot-status">Online</div>
              </div>
            </div>
            <div class="chatbot-controls">
              <button class="chatbot-minimize" id="chatbot-minimize">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.41 15.41L12 10.83L16.59 15.41L18 14L12 8L6 14L7.41 15.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="chatbot-messages" id="chatbot-messages">
            <div class="chatbot-welcome">
              <div class="chatbot-message assistant">
                <div class="chatbot-message-content">
                  <p>Hi! I'm ${
                    widgetState.agent?.name || "your AI assistant"
                  }. How can I help you today?</p>
                </div>
              </div>
            </div>
          </div>

          <div class="chatbot-input-container">
            <div class="chatbot-input-wrapper">
              <input 
                type="text" 
                class="chatbot-input" 
                id="chatbot-input" 
                placeholder="Type your message..." 
                maxlength="1000"
                disabled
              >
              <button class="chatbot-send" id="chatbot-send" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12 2.01 3 2 10L17 12 2 14 2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            ${
              config.showBranding
                ? `
              <div class="chatbot-branding">
                <span>Powered by YourApp</span>
              </div>
            `
                : ""
            }
          </div>

          <div class="chatbot-loading" id="chatbot-loading" style="display: none;">
            <div class="chatbot-typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      `;

      // Add CSS styles
      this.addStyles(config);

      // Append to document
      document.body.appendChild(this.container);

      // Store element references
      this.elements = {
        trigger: document.getElementById("chatbot-trigger"),
        window: document.getElementById("chatbot-window"),
        messages: document.getElementById("chatbot-messages"),
        input: document.getElementById("chatbot-input"),
        sendBtn: document.getElementById("chatbot-send"),
        loading: document.getElementById("chatbot-loading"),
        minimize: document.getElementById("chatbot-minimize"),
      };

      // Add event listeners
      this.setupEventListeners();
    }

    // Add CSS styles
    addStyles(config) {
      if (document.getElementById("chatbot-widget-styles")) return;

      const style = document.createElement("style");
      style.id = "chatbot-widget-styles";
      style.textContent = `
        .chatbot-widget {
          position: fixed;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color-scheme: ${config.theme};
        }

        .chatbot-widget.bottom-right {
          bottom: 20px;
          right: 20px;
        }

        .chatbot-widget.bottom-left {
          bottom: 20px;
          left: 20px;
        }

        .chatbot-widget.top-right {
          top: 20px;
          right: 20px;
        }

        .chatbot-widget.top-left {
          top: 20px;
          left: 20px;
        }

        .chatbot-trigger {
          width: 60px;
          height: 60px;
          background: #007bff;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: white;
        }

        .chatbot-trigger:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .chatbot-window {
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          position: absolute;
          bottom: 80px;
          right: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chatbot-widget.bottom-left .chatbot-window {
          left: 0;
        }

        .chatbot-widget.top-right .chatbot-window,
        .chatbot-widget.top-left .chatbot-window {
          top: 80px;
          bottom: auto;
        }

        .chatbot-header {
          background: #007bff;
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-avatar {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-name {
          font-weight: 600;
          font-size: 14px;
        }

        .chatbot-status {
          font-size: 12px;
          opacity: 0.8;
        }

        .chatbot-minimize {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.8;
        }

        .chatbot-minimize:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.1);
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chatbot-message {
          display: flex;
          gap: 8px;
          max-width: 80%;
        }

        .chatbot-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .chatbot-message-content {
          background: #f1f3f5;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
        }

        .chatbot-message.user .chatbot-message-content {
          background: #007bff;
          color: white;
        }

        .chatbot-message.assistant .chatbot-message-content {
          background: #f1f3f5;
          color: #333;
        }

        .chatbot-input-container {
          padding: 20px;
          border-top: 1px solid #e9ecef;
        }

        .chatbot-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .chatbot-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #dee2e6;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
        }

        .chatbot-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .chatbot-input:disabled {
          background: #f8f9fa;
          opacity: 0.6;
        }

        .chatbot-send {
          width: 40px;
          height: 40px;
          background: #007bff;
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .chatbot-send:hover:not(:disabled) {
          background: #0056b3;
        }

        .chatbot-send:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .chatbot-branding {
          text-align: center;
          margin-top: 8px;
          font-size: 11px;
          color: #6c757d;
        }

        .chatbot-loading {
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        .chatbot-typing-indicator {
          display: flex;
          gap: 4px;
        }

        .chatbot-typing-indicator span {
          width: 8px;
          height: 8px;
          background: #007bff;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .chatbot-typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chatbot-typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .chatbot-widget.dark .chatbot-window {
          background: #1a1a1a;
          color: white;
        }

        .chatbot-widget.dark .chatbot-message.assistant .chatbot-message-content {
          background: #2d2d2d;
          color: white;
        }

        .chatbot-widget.dark .chatbot-input {
          background: #2d2d2d;
          border-color: #404040;
          color: white;
        }

        .chatbot-widget.dark .chatbot-input-container {
          border-top-color: #404040;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 100px);
            position: fixed;
            bottom: 20px;
            right: 20px;
            left: 20px;
          }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 100px);
            position: fixed;
            bottom: 20px;
            right: 20px;
            left: 20px;
          }

          .chatbot-widget.bottom-left .chatbot-window {
            left: 20px;
          }
        }

        .chatbot-error {
          background: #dc3545;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin: 10px;
          font-size: 14px;
          text-align: center;
        }
      `;
      document.head.appendChild(style);
    }

    // Setup event listeners
    setupEventListeners() {
      // Toggle widget
      this.elements.trigger.addEventListener("click", this.toggleWidget);
      this.elements.minimize.addEventListener("click", this.toggleWidget);

      // Send message on enter
      this.elements.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Send button click
      this.elements.sendBtn.addEventListener("click", this.sendMessage);

      // Auto-resize input
      this.elements.input.addEventListener("input", () => {
        const message = this.elements.input.value.trim();
        const canSend = message.length > 0 && !widgetState.isLoading;
        this.elements.sendBtn.disabled = !canSend;
      });
    }

    // Initialize session
    async initSession() {
      try {
        // Check for existing session in localStorage
        const storedSession = this.getStoredSession();
        if (storedSession && this.isSessionValid(storedSession)) {
          widgetState.session = storedSession;
          return;
        }

        // Create new session
        const visitorInfo = {
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        };

        const result = await this.callRPC("create_widget_session", {
          agent_public_key: widgetState.agent.id,
          visitor_info_param: visitorInfo,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to create session");
        }

        widgetState.session = {
          ...result.data,
          created_at: Date.now(),
        };

        // Store session
        this.storeSession(widgetState.session);

        // Enable input
        this.elements.input.disabled = false;
        this.elements.sendBtn.disabled = false;
      } catch (error) {
        console.error("Failed to initialize session:", error);
        this.showError("Failed to connect. Please refresh the page.");
      }
    }

    // Setup WebSocket connection
    setupWebSocket() {
      if (!WIDGET_CONFIG.supabaseUrl) {
        console.warn("WebSocket not available: supabaseUrl not configured");
        return;
      }

      try {
        const wsUrl =
          WIDGET_CONFIG.supabaseUrl
            .replace("https://", "wss://")
            .replace("http://", "ws://") + "/realtime/v1/websocket";
        websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
          console.log("WebSocket connected");
          widgetState.reconnectAttempts = 0;

          // Subscribe to chat updates
          this.subscribeToUpdates();
        };

        websocket.onmessage = this.handleWebSocketMessage;

        websocket.onclose = () => {
          console.log("WebSocket disconnected");
          this.scheduleReconnect();
        };

        websocket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("Failed to setup WebSocket:", error);
      }
    }

    // Handle WebSocket messages
    handleWebSocketMessage(event) {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "INSERT" && data.table === "chats") {
          const message = data.record;
          if (
            message.session_id === widgetState.session?.session_id &&
            message.role === "assistant"
          ) {
            this.displayMessage(message.message, "assistant");
            this.setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }

    // Subscribe to chat updates
    subscribeToUpdates() {
      if (!websocket || websocket.readyState !== WebSocket.OPEN) return;

      const subscription = {
        topic: `realtime:public:chats:session_id=eq.${widgetState.session.session_id}`,
        event: "INSERT",
        ref: Date.now().toString(),
      };

      websocket.send(JSON.stringify(subscription));
    }

    // Schedule WebSocket reconnection
    scheduleReconnect() {
      if (widgetState.reconnectAttempts >= 5) {
        console.warn("Max WebSocket reconnection attempts reached");
        return;
      }

      const delay = Math.min(
        1000 * Math.pow(2, widgetState.reconnectAttempts),
        30000
      );

      reconnectTimer = setTimeout(() => {
        widgetState.reconnectAttempts++;
        console.log(
          `Reconnecting WebSocket (attempt ${widgetState.reconnectAttempts})`
        );
        this.setupWebSocket();
      }, delay);
    }

    // Toggle widget open/close
    toggleWidget() {
      if (widgetState.isOpen) {
        this.closeWidget();
      } else {
        this.openWidget();
      }
    }

    // Open widget
    openWidget() {
      this.elements.window.style.display = "flex";
      this.elements.trigger.querySelector(
        ".chatbot-trigger-icon"
      ).style.display = "none";
      this.elements.trigger.querySelector(
        ".chatbot-trigger-close"
      ).style.display = "block";

      widgetState.isOpen = true;

      // Focus input
      setTimeout(() => {
        this.elements.input.focus();
      }, 100);

      // Scroll to bottom
      this.scrollToBottom();
    }

    // Close widget
    closeWidget() {
      this.elements.window.style.display = "none";
      this.elements.trigger.querySelector(
        ".chatbot-trigger-icon"
      ).style.display = "block";
      this.elements.trigger.querySelector(
        ".chatbot-trigger-close"
      ).style.display = "none";

      widgetState.isOpen = false;
    }

    // Send message
    async sendMessage() {
      const message = this.elements.input.value.trim();
      if (!message || widgetState.isLoading || !widgetState.session) {
        return;
      }

      try {
        // Check rate limit
        const rateLimitCheck = await this.callRPC("check_widget_rate_limit", {
          session_token_param: widgetState.session.session_token,
          ip_address_param: null, // Will be handled by server
        });

        if (!rateLimitCheck.success) {
          this.showError(
            rateLimitCheck.error || "Rate limit exceeded. Please wait a moment."
          );
          return;
        }

        // Display user message
        this.displayMessage(message, "user");

        // Clear input and set loading
        this.elements.input.value = "";
        this.elements.sendBtn.disabled = true;
        this.setLoading(true);

        // Send message to API
        const result = await this.callRPC("send_widget_message", {
          session_token_param: widgetState.session.session_token,
          user_message: message,
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to send message");
        }

        // Process with AI (this would typically be handled by your backend)
        await this.processWithAI(result.data);
      } catch (error) {
        console.error("Error sending message:", error);
        this.setLoading(false);
        this.showError("Failed to send message. Please try again.");
      }
    }

    // Process message with AI
    async processWithAI(messageData) {
      try {
        // This is where you'd integrate with your AI service
        // For now, we'll simulate a response
        setTimeout(async () => {
          try {
            const aiResponse = await this.generateAIResponse(messageData);

            // Save assistant response
            const saveResult = await this.callRPC("save_assistant_response", {
              session_token_param: widgetState.session.session_token,
              assistant_message: aiResponse,
              context_used_param: null,
            });

            if (saveResult.success) {
              // Display response if not already displayed via WebSocket
              if (!websocket || websocket.readyState !== WebSocket.OPEN) {
                this.displayMessage(aiResponse, "assistant");
              }
            }

            this.setLoading(false);
          } catch (error) {
            console.error("Error processing AI response:", error);
            this.setLoading(false);
            this.showError("Sorry, I encountered an error. Please try again.");
          }
        }, 1000 + Math.random() * 2000); // Simulate processing time
      } catch (error) {
        console.error("Error in AI processing:", error);
        this.setLoading(false);
      }
    }

    // Generate AI response (placeholder - integrate with your AI service)
    async generateAIResponse(messageData) {
      // This is a placeholder. In production, you'd:
      // 1. Send to your AI service (OpenAI, etc.)
      // 2. Include system prompt and conversation context
      // 3. Handle RAG if documents are available

      const responses = [
        "Thank you for your message! I'm here to help you with any questions you might have.",
        "I understand your question. Let me provide you with some helpful information.",
        "That's a great question! Based on what you're asking, I can suggest a few options.",
        "I'm processing your request and will provide you with the best possible answer.",
        "Let me help you with that. Here's what I can tell you about your inquiry.",
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Display message in chat
    displayMessage(content, role, timestamp = null) {
      const messageEl = document.createElement("div");
      messageEl.className = `chatbot-message ${role}`;

      const timeStr = timestamp
        ? new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      messageEl.innerHTML = `
        <div class="chatbot-message-content">
          <p>${this.escapeHtml(content)}</p>
          ${
            timeStr
              ? `<div class="chatbot-message-time" style="font-size: 11px; opacity: 0.6; margin-top: 4px;">${timeStr}</div>`
              : ""
          }
        </div>
      `;

      this.elements.messages.appendChild(messageEl);
      this.scrollToBottom();

      // Store message
      widgetState.messages.push({
        content,
        role,
        timestamp: timestamp || new Date().toISOString(),
      });
    }

    // Load chat history
    async loadChatHistory() {
      if (!widgetState.session) return;

      try {
        const result = await this.callRPC("get_widget_chat_history", {
          session_token_param: widgetState.session.session_token,
          limit_param: 20,
        });

        if (result.success && result.data.messages) {
          // Clear welcome message if there are existing messages
          if (result.data.messages.length > 0) {
            this.elements.messages.innerHTML = "";
          }

          // Display messages
          result.data.messages.forEach((msg) => {
            this.displayMessage(msg.message, msg.role, msg.created_at);
          });

          widgetState.messages = result.data.messages;
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }

    // Set loading state
    setLoading(isLoading) {
      widgetState.isLoading = isLoading;
      this.elements.loading.style.display = isLoading ? "flex" : "none";
      this.elements.input.disabled = isLoading;
      this.elements.sendBtn.disabled =
        isLoading || !this.elements.input.value.trim();

      if (isLoading) {
        this.scrollToBottom();
      }
    }

    // Show error message
    showError(message) {
      const errorEl = document.createElement("div");
      errorEl.className = "chatbot-error";
      errorEl.textContent = message;

      this.elements.messages.appendChild(errorEl);
      this.scrollToBottom();

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (errorEl.parentNode) {
          errorEl.parentNode.removeChild(errorEl);
        }
      }, 5000);
    }

    // Scroll messages to bottom
    scrollToBottom() {
      setTimeout(() => {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      }, 100);
    }

    // Call RPC function
    async callRPC(functionName, params = {}) {
      const maxRetries = WIDGET_CONFIG.retryAttempts;
      let lastError;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const response = await fetch(
            `${WIDGET_CONFIG.supabaseUrl}/rest/v1/rpc/${functionName}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: WIDGET_CONFIG.anonKey || "your-anon-key",
                Authorization: `Bearer ${
                  WIDGET_CONFIG.anonKey || "your-anon-key"
                }`,
              },
              body: JSON.stringify(params),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return await response.json();
        } catch (error) {
          lastError = error;
          console.error(`RPC call attempt ${attempt + 1} failed:`, error);

          if (attempt < maxRetries - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, WIDGET_CONFIG.retryDelay * (attempt + 1))
            );
          }
        }
      }

      throw lastError;
    }

    // Session management
    getStoredSession() {
      try {
        const stored = localStorage.getItem("chatbot-session");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }

    storeSession(session) {
      try {
        localStorage.setItem("chatbot-session", JSON.stringify(session));
      } catch (error) {
        console.error("Failed to store session:", error);
      }
    }

    isSessionValid(session) {
      if (!session || !session.created_at) return false;
      return Date.now() - session.created_at < WIDGET_CONFIG.sessionExpiry;
    }

    // Utility functions
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    // Cleanup
    destroy() {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      if (websocket) {
        websocket.close();
      }

      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }

      const styles = document.getElementById("chatbot-widget-styles");
      if (styles && styles.parentNode) {
        styles.parentNode.removeChild(styles);
      }

      widgetState.isInitialized = false;
    }
  }

  // Global widget instance
  let widgetInstance = null;

  // Public API
  window.ChatbotWidget = {
    init: async (config) => {
      if (widgetInstance) {
        console.warn("ChatbotWidget already initialized");
        return;
      }

      // Extract configuration from environment or config
      config.supabaseUrl =
        config.supabaseUrl || window.NEXT_PUBLIC_SUPABASE_URL;
      config.apiUrl =
        config.apiUrl || window.NEXT_PUBLIC_SITE_URL + "/api/widget";

      widgetInstance = new ChatbotWidget();
      await widgetInstance.init(config);
    },

    destroy: () => {
      if (widgetInstance) {
        widgetInstance.destroy();
        widgetInstance = null;
      }
    },

    open: () => {
      if (widgetInstance) {
        widgetInstance.openWidget();
      }
    },

    close: () => {
      if (widgetInstance) {
        widgetInstance.closeWidget();
      }
    },

    isOpen: () => {
      return widgetState.isOpen;
    },
  };

  // Auto-initialize if config is provided via data attributes
  document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll("script[data-chatbot-id]");
    scripts.forEach((script) => {
      const config = {
        botId: script.getAttribute("data-chatbot-id"),
        position: script.getAttribute("data-position") || "bottom-right",
        theme: script.getAttribute("data-theme") || "light",
        autoOpen: script.getAttribute("data-auto-open") === "true",
        showBranding: script.getAttribute("data-show-branding") !== "false",
      };

      if (config.botId) {
        window.ChatbotWidget.init(config);
      }
    });
  });
})(window, document);
