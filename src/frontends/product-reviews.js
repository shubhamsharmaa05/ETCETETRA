// Product Reviews JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (!productId) {
    console.error("No product ID found in URL")
    return
  }

  // Initialize product data
  initializeProduct(productId)

  // Initialize reviews
  initializeReviews(productId)

  // Set up event listeners
  setupEventListeners()

  // Track recently viewed products
  trackRecentlyViewedProduct(productId)
})

// Initialize product data
function initializeProduct(productId) {
  // Get product data from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || []
  const product = products.find((p) => p.id === productId)

  if (!product) {
    console.error("Product not found")
    return
  }

  // Update product details in the UI
  document.getElementById("product-name").textContent = product.name
  document.getElementById("product-breadcrumb-name").textContent = product.name
  document.title = `${product.name} - ETCETRA`

  // Set product price
  document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`

  // Hide original price and discount badge by default
  document.getElementById("product-original-price").style.display = "none"
  document.getElementById("product-discount").style.display = "none"

  // If there's a discount, show original price and discount badge
  if (product.originalPrice && product.originalPrice > product.price) {
    document.getElementById("product-original-price").textContent = `$${product.originalPrice.toFixed(2)}`
    document.getElementById("product-original-price").style.display = "inline"

    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    document.getElementById("product-discount").textContent = `-${discountPercent}%`
    document.getElementById("product-discount").style.display = "inline"
  }

  // Set product badges
  const productBadges = document.getElementById("product-badges")
  productBadges.innerHTML = ""

  // Add badges based on product properties
  if (product.isNew) {
    const newBadge = document.createElement("span")
    newBadge.className = "badge new-badge"
    newBadge.textContent = "New"
    productBadges.appendChild(newBadge)
  }

  if (product.originalPrice && product.originalPrice > product.price) {
    const saleBadge = document.createElement("span")
    saleBadge.className = "badge sale-badge"
    saleBadge.textContent = "Sale"
    productBadges.appendChild(saleBadge)
  }

  // Set product description
  document.getElementById("product-description").innerHTML = `<p>${product.description}</p>`
  document.getElementById("full-description").innerHTML = `<p>${product.description}</p>`

  // Set product highlights
  if (product.highlights && product.highlights.length > 0) {
    const highlightsList = document.getElementById("product-highlights")
    highlightsList.innerHTML = ""

    product.highlights.forEach((highlight) => {
      const li = document.createElement("li")
      li.textContent = highlight
      highlightsList.appendChild(li)
    })
  }

  // Set product SKU
  document.getElementById("product-sku").textContent = product.id

  // Set product rating
  updateProductRating(product.rating || 5, product.reviewCount || 0)

  // Set product images
  setProductImages(product)

  // Set product sizes
  setProductSizes(product.sizes)

  // Set product colors
  setProductColors(product.colors)

  // Set product specifications
  setProductSpecifications(product)

  // Load related products
  loadRelatedProducts(product)

  // Load recently viewed products
  loadRecentlyViewedProducts(productId)
}

// Set product images
function setProductImages(product) {
  const mainImage = document.getElementById("main-product-image")
  const thumbnailGallery = document.getElementById("thumbnail-gallery")

  // Set main image
  mainImage.src = product.image
  mainImage.alt = product.name

  // Clear thumbnail gallery
  thumbnailGallery.innerHTML = ""

  // If product has multiple images
  const images = product.images || [product.image]

  // Add thumbnails
  images.forEach((image, index) => {
    const thumbnail = document.createElement("div")
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`
    thumbnail.dataset.index = index

    const img = document.createElement("img")
    img.src = image
    img.alt = `${product.name} - Image ${index + 1}`

    thumbnail.appendChild(img)
    thumbnailGallery.appendChild(thumbnail)

    // Add click event to thumbnail
    thumbnail.addEventListener("click", function () {
      // Update main image
      mainImage.src = image

      // Update active thumbnail
      document.querySelectorAll(".thumbnail").forEach((thumb) => {
        thumb.classList.remove("active")
      })
      this.classList.add("active")
    })
  })

  // Set up gallery navigation
  const prevButton = document.getElementById("gallery-prev")
  const nextButton = document.getElementById("gallery-next")

  prevButton.addEventListener("click", () => {
    const activeThumbnail = document.querySelector(".thumbnail.active")
    const index = Number.parseInt(activeThumbnail.dataset.index)
    const prevIndex = (index - 1 + images.length) % images.length

    // Click the previous thumbnail
    document.querySelector(`.thumbnail[data-index="${prevIndex}"]`).click()
  })

  nextButton.addEventListener("click", () => {
    const activeThumbnail = document.querySelector(".thumbnail.active")
    const index = Number.parseInt(activeThumbnail.dataset.index)
    const nextIndex = (index + 1) % images.length

    // Click the next thumbnail
    document.querySelector(`.thumbnail[data-index="${nextIndex}"]`).click()
  })
}

// Set product sizes
function setProductSizes(sizes) {
  const sizeOptions = document.getElementById("size-options")

  // Clear size options
  sizeOptions.innerHTML = ""

  // Add size buttons
  sizes.forEach((size) => {
    const sizeButton = document.createElement("button")
    sizeButton.className = "size-btn"
    sizeButton.textContent = size
    sizeButton.dataset.size = size

    sizeOptions.appendChild(sizeButton)

    // Add click event to size button
    sizeButton.addEventListener("click", function () {
      // Update active size
      document.querySelectorAll(".size-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")
    })
  })

  // Set first size as active
  if (sizes.length > 0) {
    sizeOptions.querySelector(".size-btn").classList.add("active")
  }
}

// Set product colors
function setProductColors(colors) {
  const colorOptions = document.getElementById("color-options")

  // Clear color options
  colorOptions.innerHTML = ""

  // Add color buttons
  colors.forEach((color) => {
    const colorButton = document.createElement("button")
    colorButton.className = "color-btn"
    colorButton.dataset.color = color
    colorButton.style.backgroundColor = color.toLowerCase()
    colorButton.title = color

    colorOptions.appendChild(colorButton)

    // Add click event to color button
    colorButton.addEventListener("click", function () {
      // Update active color
      document.querySelectorAll(".color-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")
    })
  })

  // Set first color as active
  if (colors.length > 0) {
    colorOptions.querySelector(".color-btn").classList.add("active")
  }
}

// Set product specifications
function setProductSpecifications(product) {
  const specsTableBody = document.getElementById("specs-table-body")

  // Clear specifications table
  specsTableBody.innerHTML = ""

  // Add basic specifications
  const specifications = [
    { name: "Material", value: product.material || "Cotton" },
    { name: "Colors", value: product.colors.join(", ") },
    { name: "Sizes", value: product.sizes.join(", ") },
    { name: "Category", value: product.category },
    { name: "SKU", value: product.id },
    { name: "Weight", value: product.weight || "0.5 kg" },
    { name: "Dimensions", value: product.dimensions || "30 × 20 × 5 cm" },
  ]

  // Add specifications to table
  specifications.forEach((spec) => {
    const row = document.createElement("tr")

    const th = document.createElement("th")
    th.textContent = spec.name

    const td = document.createElement("td")
    td.textContent = spec.value

    row.appendChild(th)
    row.appendChild(td)
    specsTableBody.appendChild(row)
  })
}

// Update product rating display
function updateProductRating(rating, reviewCount) {
  // Update rating stars
  const starsContainer = document.getElementById("product-rating-stars")
  starsContainer.innerHTML = ""

  // Create 5 stars
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i")

    if (i <= Math.floor(rating)) {
      // Full star
      star.className = "fas fa-star"
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      // Half star
      star.className = "fas fa-star-half-alt"
    } else {
      // Empty star
      star.className = "far fa-star"
    }

    starsContainer.appendChild(star)
  }

  // Update review count
  document.getElementById("product-rating-count").textContent = `(${reviewCount} reviews)`
  document.getElementById("review-count-tab").textContent = `(${reviewCount})`
}

// Load related products
function loadRelatedProducts(currentProduct) {
  const relatedProductsContainer = document.getElementById("related-products")

  // Get all products
  const products = JSON.parse(localStorage.getItem("products")) || []

  // Filter products by category (excluding current product)
  let relatedProducts = products.filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)

  // If not enough related products, add some random products
  if (relatedProducts.length < 4) {
    const otherProducts = products.filter((p) => p.id !== currentProduct.id && !relatedProducts.includes(p))

    // Shuffle other products
    const shuffled = otherProducts.sort(() => 0.5 - Math.random())

    // Add enough products to make 4 total
    relatedProducts = relatedProducts.concat(shuffled.slice(0, 4 - relatedProducts.length))
  }

  // Limit to 4 products
  relatedProducts = relatedProducts.slice(0, 4)

  // Clear related products container
  relatedProductsContainer.innerHTML = ""

  // Add related products
  relatedProducts.forEach((product) => {
    const productCard = document.createElement("a")
    productCard.href = `product-details.html?id=${product.id}`
    productCard.className = "product-card"

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-overlay"></div>
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-info">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <span>${product.rating || 5}</span>
          </div>
        </div>
      </div>
      <div class="product-footer">
        <button class="button outline add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `

    relatedProductsContainer.appendChild(productCard)
  })

  // Add event listeners to Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const productId = this.dataset.id
      const product = products.find((p) => p.id === productId)

      // Add to cart
      addToCart(product)
    })
  })
}

// Track recently viewed products
function trackRecentlyViewedProduct(productId) {
  // Get recently viewed products from localStorage
  let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || []

  // Remove current product if it's already in the list
  recentlyViewed = recentlyViewed.filter((id) => id !== productId)

  // Add current product to the beginning of the list
  recentlyViewed.unshift(productId)

  // Keep only the last 4 products
  recentlyViewed = recentlyViewed.slice(0, 4)

  // Save to localStorage
  localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed))
}

// Load recently viewed products
function loadRecentlyViewedProducts(currentProductId) {
  const recentlyViewedContainer = document.getElementById("recently-viewed-products")

  // Get recently viewed products from localStorage
  const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || []

  // Filter out current product
  const recentlyViewedIds = recentlyViewed.filter((id) => id !== currentProductId)

  // If no recently viewed products, hide the section
  if (recentlyViewedIds.length === 0) {
    const recentlyViewedSection = document.querySelector(".recently-viewed")
    if (recentlyViewedSection) {
      recentlyViewedSection.style.display = "none"
    }
    return
  }

  // Get all products
  const products = JSON.parse(localStorage.getItem("products")) || []

  // Get recently viewed products
  const recentlyViewedProducts = recentlyViewedIds.map((id) => products.find((p) => p.id === id)).filter((p) => p) // Filter out undefined products

  // Clear container
  recentlyViewedContainer.innerHTML = ""

  // Add recently viewed products
  recentlyViewedProducts.forEach((product) => {
    const productCard = document.createElement("a")
    productCard.href = `product-details.html?id=${product.id}`
    productCard.className = "product-card"

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-overlay"></div>
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-info">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <span>${product.rating || 5}</span>
          </div>
        </div>
      </div>
      <div class="product-footer">
        <button class="button outline add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `

    recentlyViewedContainer.appendChild(productCard)
  })

  // Add event listeners to Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const productId = this.dataset.id
      const product = products.find((p) => p.id === productId)

      // Add to cart
      addToCart(product)
    })
  })
}

// Initialize reviews
function initializeReviews(productId) {
  // Get reviews from localStorage
  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {}

  // If no reviews for this product, create empty array
  if (!reviews[productId]) {
    reviews[productId] = []
  }

  // Get reviews for this product
  const productReviews = reviews[productId]

  // Update review count
  document.getElementById("review-count-tab").textContent = `(${productReviews.length})`
  document.getElementById("total-reviews").textContent = `Based on ${productReviews.length} reviews`

  // Calculate average rating
  let averageRating = 0
  if (productReviews.length > 0) {
    averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
  }

  // Update average rating
  document.getElementById("average-rating").textContent = averageRating.toFixed(1)

  // Update average rating stars
  const averageRatingStars = document.getElementById("average-rating-stars")
  averageRatingStars.innerHTML = ""

  // Create 5 stars
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("i")

    if (i <= Math.floor(averageRating)) {
      // Full star
      star.className = "fas fa-star"
    } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
      // Half star
      star.className = "fas fa-star-half-alt"
    } else {
      // Empty star
      star.className = "far fa-star"
    }

    averageRatingStars.appendChild(star)
  }

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0] // 5, 4, 3, 2, 1 stars

  productReviews.forEach((review) => {
    ratingCounts[5 - review.rating]++
  })

  // Update rating distribution
  for (let i = 5; i >= 1; i--) {
    const count = ratingCounts[5 - i]
    const percent = productReviews.length > 0 ? Math.round((count / productReviews.length) * 100) : 0

    document.getElementById(`rating-${i}-fill`).style.width = `${percent}%`
    document.getElementById(`rating-${i}-percent`).textContent = `${percent}%`
  }

  // Display reviews
  displayReviews(productReviews)

  // Update product rating in localStorage
  updateProductRatingInStorage(productId, averageRating, productReviews.length)
}

// Display reviews
function displayReviews(reviews, sortBy = "newest", filterBy = "all") {
  const reviewsList = document.getElementById("reviews-list")
  const noReviews = document.getElementById("no-reviews")

  // Sort reviews
  let sortedReviews = [...reviews]

  switch (sortBy) {
    case "newest":
      sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case "highest":
      sortedReviews.sort((a, b) => b.rating - a.rating)
      break
    case "lowest":
      sortedReviews.sort((a, b) => a.rating - b.rating)
      break
    case "helpful":
      sortedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0))
      break
  }

  // Filter reviews
  if (filterBy !== "all") {
    const filterRating = Number.parseInt(filterBy)
    sortedReviews = sortedReviews.filter((review) => review.rating === filterRating)
  }

  // Clear reviews list
  reviewsList.innerHTML = ""

  // Show or hide no reviews message
  if (sortedReviews.length === 0) {
    noReviews.style.display = "block"
    return
  } else {
    noReviews.style.display = "none"
  }

  // Add reviews to list
  sortedReviews.forEach((review) => {
    const reviewItem = document.createElement("div")
    reviewItem.className = "review-item"
    reviewItem.dataset.id = review.id

    // Format date
    const reviewDate = new Date(review.date)
    const formattedDate = reviewDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Create rating stars
    let ratingStars = ""
    for (let i = 1; i <= 5; i++) {
      if (i <= review.rating) {
        ratingStars += '<i class="fas fa-star"></i>'
      } else {
        ratingStars += '<i class="far fa-star"></i>'
      }
    }

    reviewItem.innerHTML = `
      <div class="review-header">
        <div class="review-author">${review.name}</div>
        <div class="review-date">${formattedDate}</div>
      </div>
      <div class="review-rating">
        ${ratingStars}
      </div>
      <div class="review-title">${review.title}</div>
      <div class="review-content">${review.content}</div>
      <div class="review-footer">
        <div class="review-helpful">
          <span>Was this review helpful?</span>
          <button class="helpful-btn ${review.helpful ? "active" : ""}" data-review-id="${review.id}">
            <i class="fas fa-thumbs-up"></i>
            <span>${review.helpfulCount || 0}</span>
          </button>
        </div>
      </div>
    `

    reviewsList.appendChild(reviewItem)
  })

  // Add event listeners to helpful buttons
  document.querySelectorAll(".helpful-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const reviewId = this.dataset.reviewId
      markReviewAsHelpful(reviewId)
    })
  })
}

// Mark review as helpful
function markReviewAsHelpful(reviewId) {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  // Get reviews from localStorage
  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {}

  // If no reviews for this product, return
  if (!reviews[productId]) {
    return
  }

  // Find review
  const reviewIndex = reviews[productId].findIndex((review) => review.id === reviewId)

  if (reviewIndex === -1) {
    return
  }

  // Toggle helpful status
  const review = reviews[productId][reviewIndex]
  review.helpful = !review.helpful

  // Update helpful count
  review.helpfulCount = review.helpful ? (review.helpfulCount || 0) + 1 : (review.helpfulCount || 1) - 1

  // Update reviews in localStorage
  localStorage.setItem("productReviews", JSON.stringify(reviews))

  // Update UI
  const helpfulButton = document.querySelector(`.helpful-btn[data-review-id="${reviewId}"]`)

  if (review.helpful) {
    helpfulButton.classList.add("active")
  } else {
    helpfulButton.classList.remove("active")
  }

  helpfulButton.querySelector("span").textContent = review.helpfulCount
}

// Update product rating in localStorage
function updateProductRatingInStorage(productId, rating, reviewCount) {
  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || []

  // Find product
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    return
  }

  // Update product rating and review count
  products[productIndex].rating = rating
  products[productIndex].reviewCount = reviewCount

  // Save products to localStorage
  localStorage.setItem("products", JSON.stringify(products))
}

// Add a new review
function addReview(review) {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  // Get reviews from localStorage
  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {}

  // If no reviews for this product, create empty array
  if (!reviews[productId]) {
    reviews[productId] = []
  }

  // Add review to array
  reviews[productId].push(review)

  // Save reviews to localStorage
  localStorage.setItem("productReviews", JSON.stringify(reviews))

  // Reinitialize reviews
  initializeReviews(productId)
}

// Set up event listeners
function setupEventListeners() {
  // Quantity buttons
  const quantityInput = document.getElementById("quantity")
  const quantityMinus = document.getElementById("quantity-minus")
  const quantityPlus = document.getElementById("quantity-plus")

  quantityMinus.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value)
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1
    }
  })

  quantityPlus.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value)
    quantityInput.value = currentValue + 1
  })

  // Tab buttons
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab

      // Update active tab button
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")

      // Update active tab panel
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.remove("active")
      })
      document.getElementById(`${tabId}-panel`).classList.add("active")
    })
  })

  // Add to cart button
  const addToCartBtn = document.getElementById("add-to-cart-btn")

  addToCartBtn.addEventListener("click", () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("id")

    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || []
    const product = products.find((p) => p.id === productId)

    if (!product) {
      return
    }

    // Get selected size
    const selectedSizeBtn = document.querySelector(".size-btn.active")
    const size = selectedSizeBtn ? selectedSizeBtn.dataset.size : product.sizes[0]

    // Get selected color
    const selectedColorBtn = document.querySelector(".color-btn.active")
    const color = selectedColorBtn ? selectedColorBtn.dataset.color : product.colors[0]

    // Get quantity
    const quantity = Number.parseInt(document.getElementById("quantity").value)

    // Add to cart
    addToCartDetail(productId, product.name, product.price, product.image, size, quantity)
  })

  // Buy now button
  const buyNowBtn = document.getElementById("buy-now-btn")

  buyNowBtn.addEventListener("click", () => {
    // Trigger add to cart
    addToCartBtn.click()

    // Redirect to cart page
    window.location.href = "cart.html"
  })

  // Wishlist button
  const wishlistBtn = document.getElementById("wishlist-btn")

  wishlistBtn.addEventListener("click", function () {
    const icon = this.querySelector("i")

    if (icon.classList.contains("far")) {
      // Add to wishlist
      icon.classList.remove("far")
      icon.classList.add("fas")
      showNotification("Product added to wishlist!")
    } else {
      // Remove from wishlist
      icon.classList.remove("fas")
      icon.classList.add("far")
      showNotification("Product removed from wishlist!")
    }
  })

  // Share button
  const shareBtn = document.getElementById("share-btn")

  shareBtn.addEventListener("click", () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error))
    } else {
      // Fallback
      const tempInput = document.createElement("input")
      tempInput.value = window.location.href
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand("copy")
      document.body.removeChild(tempInput)

      showNotification("Link copied to clipboard!")
    }
  })

  // Reviews sort and filter
  const reviewsSort = document.getElementById("reviews-sort")
  const reviewsFilter = document.getElementById("reviews-filter")

  reviewsSort.addEventListener("change", function () {
    const sortBy = this.value
    const filterBy = reviewsFilter.value

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("id")

    // Get reviews from localStorage
    const reviews = JSON.parse(localStorage.getItem("productReviews")) || {}

    // If no reviews for this product, create empty array
    if (!reviews[productId]) {
      reviews[productId] = []
    }

    // Display reviews with sort and filter
    displayReviews(reviews[productId], sortBy, filterBy)
  })

  reviewsFilter.addEventListener("change", function () {
    const filterBy = this.value
    const sortBy = reviewsSort.value

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("id")

    // Get reviews from localStorage
    const reviews = JSON.parse(localStorage.getItem("productReviews")) || {}

    // If no reviews for this product, create empty array
    if (!reviews[productId]) {
      reviews[productId] = []
    }

    // Display reviews with sort and filter
    displayReviews(reviews[productId], sortBy, filterBy)
  })

  // Write review button
  const writeReviewBtn = document.getElementById("write-review-btn")
  const reviewFormModal = document.getElementById("review-form-modal")
  const closeReviewForm = document.getElementById("close-review-form")
  const cancelReview = document.getElementById("cancel-review")

  writeReviewBtn.addEventListener("click", () => {
    reviewFormModal.classList.add("active")
  })

  closeReviewForm.addEventListener("click", () => {
    reviewFormModal.classList.remove("active")
  })

  if (cancelReview) {
    cancelReview.addEventListener("click", () => {
      reviewFormModal.classList.remove("active")
    })
  }

  // Rating input in review form
  const ratingInput = document.querySelectorAll(".rating-input i")
  const ratingValue = document.getElementById("review-rating")
  const ratingText = document.querySelector(".rating-text")

  ratingInput.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const rating = Number.parseInt(this.dataset.rating)

      // Update stars on hover
      ratingInput.forEach((s, index) => {
        if (index < rating) {
          s.className = "fas fa-star"
        } else {
          s.className = "far fa-star"
        }
      })

      // Update rating text
      updateRatingText(rating)
    })

    star.addEventListener("mouseout", () => {
      const rating = Number.parseInt(ratingValue.value)

      // Reset stars on mouseout
      ratingInput.forEach((s, index) => {
        if (index < rating) {
          s.className = "fas fa-star"
        } else {
          s.className = "far fa-star"
        }
      })

      // Update rating text
      updateRatingText(rating)
    })

    star.addEventListener("click", function () {
      const rating = Number.parseInt(this.dataset.rating)

      // Set rating value
      ratingValue.value = rating

      // Update stars
      ratingInput.forEach((s, index) => {
        if (index < rating) {
          s.className = "fas fa-star"
        } else {
          s.className = "far fa-star"
        }
      })

      // Update rating text
      updateRatingText(rating)
    })
  })

  // Update rating text based on rating value
  function updateRatingText(rating) {
    if (!ratingText) return

    switch (rating) {
      case 0:
        ratingText.textContent = "Select a rating"
        break
      case 1:
        ratingText.textContent = "Poor"
        break
      case 2:
        ratingText.textContent = "Fair"
        break
      case 3:
        ratingText.textContent = "Average"
        break
      case 4:
        ratingText.textContent = "Good"
        break
      case 5:
        ratingText.textContent = "Excellent"
        break
    }
  }

  // Review form submission
  const reviewForm = document.getElementById("review-form")

  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form values
    const name = document.getElementById("review-name").value
    const email = document.getElementById("review-email").value
    const rating = Number.parseInt(document.getElementById("review-rating").value)
    const title = document.getElementById("review-title").value
    const content = document.getElementById("review-content").value

    // Validate rating
    if (rating === 0) {
      showNotification("Please select a rating", "error")
      return
    }

    // Create review object
    const review = {
      id: Date.now().toString(),
      name,
      email,
      rating,
      title,
      content,
      date: new Date().toISOString(),
      helpful: false,
      helpfulCount: 0,
    }

    // Add review
    addReview(review)

    // Close modal
    reviewFormModal.classList.remove("active")

    // Reset form
    this.reset()
    ratingValue.value = "0"
    ratingInput.forEach((star) => {
      star.className = "far fa-star"
    })
    if (ratingText) {
      ratingText.textContent = "Select a rating"
    }

    // Show success message
    showNotification("Thank you for your review!")

    // Scroll to reviews tab
    document.querySelector('.tab-btn[data-tab="reviews"]').click()
    document.getElementById("reviews-panel").scrollIntoView({ behavior: "smooth" })
  })
}

// Function to show notification
function showNotification(message, type = "success") {
  // Use the existing showNotification function from script.js if available
  if (typeof window.showNotification === "function") {
    window.showNotification(message, type)
    return
  }

  // Create notification element if it doesn't exist
  let notification = document.getElementById("notification")

  if (!notification) {
    notification = document.createElement("div")
    notification.id = "notification"
    notification.className = "notification"
    document.body.appendChild(notification)
  }

  // Set notification content and type
  notification.textContent = message
  notification.className = `notification ${type}`

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Initialize some sample reviews if none exist
function initializeSampleReviews() {
  // Get reviews from localStorage
  const reviews = JSON.parse(localStorage.getItem("productReviews")) || {}

  // Sample reviews for product 1
  if (!reviews["1"] || reviews["1"].length === 0) {
    reviews["1"] = [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex@example.com",
        rating: 5,
        title: "Perfect fit and quality!",
        content:
          "This oversized tee is exactly what I was looking for. The material is soft and comfortable, and the fit is perfect. Highly recommend!",
        date: "2023-03-15T10:30:00Z",
        helpful: true,
        helpfulCount: 12,
      },
      {
        id: "2",
        name: "Jordan Smith",
        email: "jordan@example.com",
        rating: 4,
        title: "Great shirt, runs a bit large",
        content:
          "Really nice shirt, quality is great. Only giving 4 stars because it runs a bit larger than expected. I would recommend sizing down if you prefer a less oversized fit.",
        date: "2023-02-20T14:15:00Z",
        helpful: true,
        helpfulCount: 8,
      },
      {
        id: "3",
        name: "Taylor Wilson",
        email: "taylor@example.com",
        rating: 5,
        title: "Amazing quality",
        content:
          "The fabric is so soft and the stitching is perfect. This has quickly become my favorite t-shirt. Will definitely buy more colors!",
        date: "2023-01-10T09:45:00Z",
        helpful: true,
        helpfulCount: 5,
      },
    ]

    // Save reviews to localStorage
    localStorage.setItem("productReviews", JSON.stringify(reviews))
  }
}

// Call initializeSampleReviews on page load
initializeSampleReviews()

// Dummy functions to avoid errors, assuming they are defined elsewhere
function addToCart(product) {
  // Use the existing addToCart function from script.js if available
  if (typeof window.addToCart === "function") {
    window.addToCart(product)
    return
  }

  console.log("Adding to cart:", product)

  // Fallback implementation
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id === product.id)

  if (existingItemIndex !== -1) {
    // Update quantity if product already exists
    cart[existingItemIndex].quantity += 1
  } else {
    // Add new item to cart
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show notification
  showNotification(`${product.name} has been added to your cart!`)
}

function addToCartDetail(productId, name, price, image, size, quantity) {
  // Use the existing addToCartDetail function from script.js if available
  if (typeof window.addToCartDetail === "function") {
    window.addToCartDetail(productId, name, price, image, size, quantity)
    return
  }

  console.log("Adding to cart with details:", { productId, name, price, image, size, quantity })

  // Fallback implementation
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product already exists in cart with the same size
  const existingItemIndex = cart.findIndex((item) => item.id === productId && item.size === size)

  if (existingItemIndex !== -1) {
    // Update quantity if product already exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item to cart
    cart.push({
      id: productId,
      name: name,
      price: price,
      image: image,
      size: size,
      quantity: quantity,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show notification
  showNotification(`${name} has been added to your cart!`)
}

function updateCartCount() {
  // Use the existing updateCartCount function from script.js if available
  if (typeof window.updateCartCount === "function") {
    window.updateCartCount()
    return
  }

  // Fallback implementation
  const cartCountElement = document.getElementById("cartCount")
  if (!cartCountElement) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  cartCountElement.textContent = totalItems

  if (totalItems > 0) {
    cartCountElement.style.display = "flex"
  } else {
    cartCountElement.style.display = "none"
  }
}

