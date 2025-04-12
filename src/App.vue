<script setup>
// 组件逻辑
</script>

<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-content">
        <h1>日语词汇学习</h1>
      </div>
    </nav>
    
    <main class="main-content">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #58cc02;
  --primary-hover: #4caf02;
  --secondary-color: #1cb0f6;
  --secondary-hover: #1899d6;
  --text-color: #3c3c3c;
  --light-gray: #f7f7f7;
  --border-color: #e5e5e5;
  --max-width: 1200px;
  --mobile-width: 600px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--light-gray);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-content h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.main-content {
  flex: 1;
  margin-top: 4rem;
  padding: 2rem 1rem;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-content {
    padding: 1rem;
  }
  
  .nav-content h1 {
    font-size: 1.2rem;
  }
  
  .main-content {
    padding: 1rem 0.5rem;
  }
  
  .container {
    padding: 0 0.5rem;
  }
}

/* 通用样式 */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-secondary:hover {
  background: var(--secondary-hover);
}

.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
