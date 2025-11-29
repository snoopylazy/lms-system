<template>
  <div class="glass-404-container">
    <div class="glass-card">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>

      <router-link to="/admin" class="home-btn">
        Go Back Home
      </router-link>
    </div>

    <div class="bg-circle circle1"></div>
    <div class="bg-circle circle2"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Full screen layout */
.glass-404-container {
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Glass Card */
.glass-card {
  width: 380px;
  padding: 40px 30px;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  text-align: center;
  animation: fadeIn 1.2s ease-out;
}

/* Title */
.glass-card h1 {
  font-size: 90px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  color: transparent;
}

/* Subtitle */
.glass-card p {
  color: #f1f5f9;
  opacity: 0.85;
  margin: 15px 0 25px;
  font-size: 18px;
}

/* Button */
.home-btn {
  padding: 12px 30px;
  border-radius: 40px;
  text-decoration: none;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  backdrop-filter: blur(5px);
  transition: 0.3s;
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.07);
}

/* Background Glow Circles */
.bg-circle {
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  animation: float 6s infinite ease-in-out;
}

.circle1 {
  background: #3b82f6;
  top: -80px;
  left: -60px;
}

.circle2 {
  background: #a855f7;
  bottom: -80px;
  right: -50px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(20px, -20px);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>
