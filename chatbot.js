
// chatbot.js

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = \`
    #chatbot-widget {
      position: fixed;
      bottom: 80px;
      left: 20px;
      width: 320px;
      max-height: 500px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      font-family: 'Segoe UI', sans-serif;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
    }

    #chatbot-header {
      background-color: #3498db;
      color: white;
      padding: 10px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #chatbot-body {
      padding: 10px;
      flex-grow: 1;
      overflow-y: auto;
    }

    #chatbot-suggestions {
      border-top: 1px solid #eee;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background-color: #f9f9f9;
    }

    .chatbot-message {
      margin: 5px 0;
    }

    .bot {
      color: #2c3e50;
    }

    .user {
      font-weight: bold;
      text-align: right;
      color: #2980b9;
    }

    .chatbot-suggestion {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    }

    #chatbot-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
    }
  \`;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "chatbot-widget";
  widget.innerHTML = \`
    <div id="chatbot-header">
      <span>Aide</span>
      <i class="fas fa-times" id="chatbot-close" style="cursor:pointer;"></i>
    </div>
    <div id="chatbot-body"></div>
    <div id="chatbot-suggestions"></div>
  \`;
  document.body.appendChild(widget);

  const toggle = document.createElement("button");
  toggle.id = "chatbot-toggle";
  toggle.innerHTML = '<i class="fas fa-comment-dots"></i>';
  document.body.appendChild(toggle);

  const chatbotBody = document.getElementById("chatbot-body");
  const suggestionsBox = document.getElementById("chatbot-suggestions");

  const QAs = {
    start: [
      "Comment signaler un objet perdu ?",
      "Comment contacter l'administrateur ?",
      "Où voir les objets trouvés ?"
    ],
    "Comment signaler un objet perdu ?": "Clique sur le bouton 'Signaler un Objet Perdu' en page d'accueil et remplis le formulaire.",
    "Comment contacter l'administrateur ?": "Tu peux contacter l'administrateur par WhatsApp au +221 78 922 91 04, email à 5s9lost@gmail.com, ou via Google Chat.",
    "Où voir les objets trouvés ?": "Rends-toi dans l'onglet 'Notifications' pour consulter les listes des objets trouvés."
  };

  function saveToLocalStorage() {
    localStorage.setItem("chatbotHistory", chatbotBody.innerHTML);
  }

  function restoreFromLocalStorage() {
    const saved = localStorage.getItem("chatbotHistory");
    if (saved) chatbotBody.innerHTML = saved;
  }

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = "chatbot-message " + sender;
    msg.textContent = text;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    saveToLocalStorage();
  }

  function showSuggestions(forQuestion = "start") {
    suggestionsBox.innerHTML = "";
    const options = QAs[forQuestion] instanceof Array ? QAs[forQuestion] : QAs["start"];
    options.forEach((q) => {
      const btn = document.createElement("button");
      btn.className = "chatbot-suggestion";
      btn.textContent = q;
      btn.onclick = () => {
        addMessage(q, "user");
        setTimeout(() => {
          addMessage(QAs[q] || "Je n'ai pas encore la réponse à cela.", "bot");
          showSuggestions(); // loop again
        }, 400);
      };
      suggestionsBox.appendChild(btn);
    });
  }

  document.getElementById("chatbot-toggle").onclick = () => {
    widget.style.display = "flex";
    restoreFromLocalStorage();
    if (!chatbotBody.innerHTML) {
      setTimeout(() => {
        addMessage("Bonjour ! Comment puis-je vous aider ?", "bot");
        showSuggestions();
      }, 300);
    } else {
      showSuggestions();
    }
  };

  document.getElementById("chatbot-close").onclick = () => {
    widget.style.display = "none";
  };
});
