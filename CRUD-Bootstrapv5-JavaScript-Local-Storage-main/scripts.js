// AuthController: Handles authentication-related logic (Singleton Pattern)
const AuthController = (() => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = null;

  const saveUsersToStorage = () => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const setCurrentUser = (user) => {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser"));
  };

  return {
    registerUser(username, password) {
      if (users.some((user) => user.username === username)) {
        throw new Error("Username already exists!");
      }
      users.push({ username, password });
      saveUsersToStorage();
    },

    loginUser(username, password) {
      const user = users.find(
        (user) => user.username === username && user.password === password
      );
      if (!user) {
        throw new Error("Invalid username or password!");
      }
      setCurrentUser(user);
    },

    logoutUser() {
      localStorage.removeItem("currentUser");
      currentUser = null;
    },

    getCurrentUser,
  };
})();

// UIController: Handles all UI-related logic (Module Design Pattern)
const UIController = (() => {
  const redirectTo = (url) => {
    window.location.href = url;
  };

  const showAlert = (message) => {
    alert(message);
  };

  const displayWelcomeMessage = (username) => {
    const messageElement = document.getElementById("welcomeMessage");
    if (messageElement) {
      messageElement.textContent = `Hello, ${username}!`;
    }
  };

  return {
    handleRegisterFormSubmit(event) {
      event.preventDefault();
      const username = document
        .getElementById("registerUsername")
        .value.trim();
      const password = document
        .getElementById("registerPassword")
        .value.trim();

      try {
        AuthController.registerUser(username, password);
        showAlert("Registration successful! Please log in.");
        redirectTo("login.html");
      } catch (error) {
        showAlert(error.message);
      }
    },

    handleLoginFormSubmit(event) {
      event.preventDefault();
      const username = document
        .getElementById("loginUsername")
        .value.trim();
      const password = document
        .getElementById("loginPassword")
        .value.trim();

      try {
        AuthController.loginUser(username, password);
        redirectTo("index.html");
      } catch (error) {
        showAlert(error.message);
      }
    },

    handleProfilePage() {
      const currentUser = AuthController.getCurrentUser();
      if (!currentUser) {
        showAlert("Please log in first!");
        redirectTo("login.html");
      } else {
        displayWelcomeMessage(currentUser.username);
      }
    },

    handleLogout() {
      AuthController.logoutUser();
      redirectTo("login.html");
    },
  };
})();

// Event Listeners: Attach events to form elements
document
  .getElementById("registerForm")
  ?.addEventListener("submit", UIController.handleRegisterFormSubmit);

document
  .getElementById("loginForm")
  ?.addEventListener("submit", UIController.handleLoginFormSubmit);

if (window.location.pathname.includes("index.html")) {
  UIController.handleProfilePage();
}
