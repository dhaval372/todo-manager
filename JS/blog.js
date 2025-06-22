// ====== Blog Post Data ======
let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];

// ====== DOM Elements ======
const blogForm = document.getElementById("blogForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const tagsInput = document.getElementById("tags");
const postList = document.getElementById("postList");
const searchInput = document.getElementById("searchInput");

// ====== Event Listeners ======
blogForm.addEventListener("submit", handleCreatePost);
searchInput.addEventListener("input", searchAndRender);

function searchAndRender() {
  const search = searchInput.value.toLowerCase();
  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(search) ||
    post.tags.some(tag => tag.includes(search))
  );

  renderPosts(filtered);
}

// ====== Create Blog Post ======
function handleCreatePost(e) {
  e.preventDefault();

  const post = {
    id: Date.now(),
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    tags: tagsInput.value.split(",").map(tag => tag.trim().toLowerCase()).filter(tag => tag),
    createdAt: new Date().toISOString()
  };

  posts.unshift(post); // add newest on top
  savePosts();
  renderPosts();
  blogForm.reset();
}

// ====== Save to LocalStorage ======
function savePosts() {
  localStorage.setItem("blogPosts", JSON.stringify(posts));
}

// ====== Render Posts ======
function renderPosts(filteredPosts = posts) {
  postList.innerHTML = "";

  filteredPosts.forEach(post => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";

    div.innerHTML = `
      <h3 class="text-xl font-bold">${post.title}</h3>
      <p class="text-sm text-gray-500 mb-2">${new Date(post.createdAt).toLocaleString()}</p>
      <p class="mb-2">${post.content.slice(0, 100)}...</p>
      <div class="flex gap-2 text-sm mb-2">
        ${post.tags.map(tag => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${tag}</span>`).join("")}
      </div>
      <button onclick="viewPost(${post.id})" class="text-blue-600 mr-2">View</button>
      <button onclick="editPost(${post.id})" class="text-yellow-600 mr-2">Edit</button>
      <button onclick="deletePost(${post.id})" class="text-red-600">Delete</button>
    `;

    postList.appendChild(div);
  });
}


// ====== View Full Post (placeholder) ======
function viewPost(id) {
  const post = posts.find(p => p.id === id);
  alert(`Full Post:\n\n${post.content}`);
}

// ====== Edit Post ======
function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  const newTitle = prompt("Edit title:", post.title);
  const newContent = prompt("Edit content:", post.content);
  const newTags = prompt("Edit tags (comma separated):", post.tags.join(", "));

  if (newTitle !== null && newContent !== null) {
    post.title = newTitle.trim();
    post.content = newContent.trim();
    post.tags = newTags.split(",").map(t => t.trim().toLowerCase()).filter(t => t);
    savePosts();
    renderPosts();
  }
}

// ====== Delete Post ======
function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  posts = posts.filter(p => p.id !== id);
  savePosts();
  renderPosts();
}

// ====== Initial Load ======
renderPosts();
