async function loadProfile(userId) {
    if (!userId) return;

    try {
        const response = await fetch(`/users/profile/${userId}`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "User not found");
            return;
        }

        const usernameEl = document.getElementById("username");
        const emailEl = document.getElementById("email");

        if (usernameEl) usernameEl.textContent = data.username;
        if (emailEl) emailEl.textContent = data.email;

    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

async function searchUsers() {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        document.getElementById("results").innerHTML =
            "<li>Fill the name for search</li>";
        return;
    }

    try {
        const response = await fetch(`/users/search?q=${encodeURIComponent(query)}`);
        const users = await response.json();

        const resultsEl = document.getElementById("results");
        resultsEl.innerHTML = "";

        if (!response.ok) {
            resultsEl.innerHTML = `<li>${users.error || "Error druing search"}</li>`;
            return;
        }

        if (users.length === 0) {
            resultsEl.innerHTML = "<li>No user found</li>";
            return;
        }

        users.forEach(user => {
            const li = document.createElement("li");
            li.textContent = `${user.username} (${user.email})`;
            resultsEl.appendChild(li);
        });

    } catch (error) {
        console.error("Error searching users:", error);
        document.getElementById("results").innerHTML =
            "<li>Error on server</li>";
    }
}