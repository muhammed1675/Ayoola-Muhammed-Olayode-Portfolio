// Navigation functionality
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const navbar = document.querySelector(".navbar")

// Mobile menu toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    navToggle.classList.remove("active")
  })
})

// Navbar background on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Carousel functionality
class Carousel {
  constructor(carouselId) {
    this.carousel = document.getElementById(carouselId)
    this.leftBtn = document.querySelector(`[data-carousel="${carouselId}"].carousel-btn-left`)
    this.rightBtn = document.querySelector(`[data-carousel="${carouselId}"].carousel-btn-right`)
    this.cardWidth = 200 // Width of each movie card
    this.gap = 8 // Gap between cards (0.5rem = 8px)
    this.scrollAmount = this.cardWidth + this.gap

    this.init()
  }

  init() {
    if (this.leftBtn && this.rightBtn) {
      this.leftBtn.addEventListener("click", () => this.scrollLeft())
      this.rightBtn.addEventListener("click", () => this.scrollRight())
    }

    // Update button visibility on scroll
    this.carousel.addEventListener("scroll", () => this.updateButtons())
    this.updateButtons()
  }

  scrollLeft() {
    this.carousel.scrollBy({
      left: -this.scrollAmount * 3, // Scroll 3 cards at a time
      behavior: "smooth",
    })
  }

  scrollRight() {
    this.carousel.scrollBy({
      left: this.scrollAmount * 3, // Scroll 3 cards at a time
      behavior: "smooth",
    })
  }

  updateButtons() {
    const scrollLeft = this.carousel.scrollLeft
    const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth

    // Hide/show buttons based on scroll position
    if (this.leftBtn) {
      this.leftBtn.style.opacity = scrollLeft <= 0 ? "0.5" : "1"
    }

    if (this.rightBtn) {
      this.rightBtn.style.opacity = scrollLeft >= maxScroll ? "0.5" : "1"
    }
  }
}

// Initialize carousels
document.addEventListener("DOMContentLoaded", () => {
  new Carousel("trending")
  new Carousel("top-picks")
  new Carousel("new-releases")
})

// Movie card hover effects and interactions
document.querySelectorAll(".movie-card").forEach((card) => {
  card.addEventListener("click", () => {
    const movieTitle = card.querySelector("h3").textContent
    alert(`You clicked on: ${movieTitle}`)
    // In a real application, this would navigate to the movie details page
  })
})

// Hero buttons functionality
document.querySelector(".btn-primary").addEventListener("click", () => {
  alert("Play button clicked! In a real app, this would start playing the movie.")
})

document.querySelector(".btn-secondary").addEventListener("click", () => {
  alert("More Info button clicked! In a real app, this would show movie details.")
})

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Keyboard navigation for carousels
document.addEventListener("keydown", (e) => {
  const focusedElement = document.activeElement

  if (focusedElement.classList.contains("movie-card")) {
    const carousel = focusedElement.closest(".carousel")
    const cards = Array.from(carousel.querySelectorAll(".movie-card"))
    const currentIndex = cards.indexOf(focusedElement)

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        if (currentIndex > 0) {
          cards[currentIndex - 1].focus()
        }
        break
      case "ArrowRight":
        e.preventDefault()
        if (currentIndex < cards.length - 1) {
          cards[currentIndex + 1].focus()
        }
        break
      case "Enter":
      case " ":
        e.preventDefault()
        focusedElement.click()
        break
    }
  }
})

// Make movie cards focusable for keyboard navigation
document.querySelectorAll(".movie-card").forEach((card) => {
  card.setAttribute("tabindex", "0")
})

// Intersection Observer for lazy loading effect
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Apply fade-in animation to content rows
document.querySelectorAll(".content-row").forEach((row) => {
  row.style.opacity = "0"
  row.style.transform = "translateY(20px)"
  row.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(row)
})
