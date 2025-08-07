// Initialize mobile menu and submenu functionality
function initializeMobile() {
	// Select main DOM elements for mobile menu
	const menu = document.querySelector("#mobile-menu")
	const overlay = document.querySelector("#mobile-menu-overlay")
	const burger = document.querySelector("#burger")
	const body = document.querySelector("body")

	// Define mobile breakpoint for responsive behavior
	const MOBILE_BREAKPOINT = 1024

	// Exit if required elements are missing
	if (!menu || !burger || !body || !overlay) return

	// ============================
	// MENU TOGGLE FUNCTIONALITY
	// ============================

	const updateMenuState = (isOpen) => {
		burger.setAttribute("aria-expanded", isOpen)
		burger.classList.toggle("active", isOpen)

		menu.classList.toggle("is-open", isOpen)
		menu.classList.toggle("-translate-x-full", !isOpen)
		menu.classList.toggle("translate-x-0", isOpen)

		overlay.classList.toggle("opacity-0", !isOpen)
		overlay.classList.toggle("opacity-100", isOpen)
		overlay.classList.toggle("pointer-events-none", !isOpen)
		overlay.classList.toggle("pointer-events-auto", isOpen)

		body.classList.toggle("overflow-hidden", isOpen)
	}

	const handleBurgerClick = () => {
		const isOpening = !menu.classList.contains("is-open")
		updateMenuState(isOpening)
	}

	const handleOverlayClick = (event) => {
		if (event.target === overlay) updateMenuState(false)
	}

	const handleEscapeKey = (event) => {
		if (event.key === "Escape" && menu.classList.contains("is-open")) {
			updateMenuState(false)
		}
	}

	const handleWindowResize = () => {
		if (window.innerWidth >= MOBILE_BREAKPOINT) {
			updateMenuState(false)
		}
	}

	// Add event listeners for main menu
	burger.addEventListener("click", handleBurgerClick)
	overlay.addEventListener("click", handleOverlayClick)
	document.addEventListener("keydown", handleEscapeKey)
	window.addEventListener("resize", handleWindowResize)

	burger.setAttribute("aria-expanded", "false")
	handleWindowResize()
}
initializeMobile()

// Dark theme toggle
/**
 * Initializes a dark/light mode toggle by attaching a click listener
 * to the provided toggle element. Also syncs the state with localStorage.
 *
 * @param {string} toggleButtonId - The ID of the button that toggles the theme
 */
function initThemeToggle(toggleButtonId = "toggle-mode") {
	const toggleButton = document.getElementById(toggleButtonId)

	// Ensure the toggle button exists
	if (!toggleButton) {
		console.error(
			`initThemeToggle: Element with ID "${toggleButtonId}" not found.`,
		)
		return
	}

	// Apply saved theme on page load
	const savedTheme = localStorage.getItem("theme")
	if (savedTheme === "dark") {
		document.documentElement.classList.add("dark")
	} else if (savedTheme === "light") {
		document.documentElement.classList.remove("dark")
	}

	// Toggle theme on click
	toggleButton.addEventListener("click", () => {
		const isDark = document.documentElement.classList.toggle("dark")

		// Save the new theme preference
		localStorage.setItem("theme", isDark ? "dark" : "light")
	})
}
initThemeToggle()

// Searchbar
function initSearchBar(containerId, inputId, dropdownId, clearBtnId) {
	const searchInput = document.getElementById(inputId)
	const dropdown = document.getElementById(dropdownId)
	const clearBtn = document.getElementById(clearBtnId)
	const container = document.getElementById(containerId)

	// Check if all required elements exist
	if (!searchInput || !dropdown || !clearBtn || !container) {
		console.error("initSearchBar: One or more elements not found")
		return
	}

	// Helper function to show/hide dropdown and styles
	function toggleDropdown(show) {
		dropdown.classList.toggle("hidden", !show)
		clearBtn.classList.toggle("hidden", !show)
		container.classList.toggle("active", show)
	}

	// Show dropdown when user types something
	searchInput.addEventListener("input", () => {
		const hasValue = searchInput.value.trim() !== ""
		toggleDropdown(hasValue)
	})

	// Clear input and hide dropdown on clear button click
	clearBtn.addEventListener("click", () => {
		searchInput.value = ""
		toggleDropdown(false)
		searchInput.focus()
	})

	// Hide dropdown when clicking outside of input or dropdown
	document.addEventListener("click", (e) => {
		if (!e.target.closest(`#${containerId}`)) {
			toggleDropdown(false)
		}
	})

	// Optional: Hide dropdown when pressing Escape
	searchInput.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			toggleDropdown(false)
			searchInput.blur()
		}
	})
}
initSearchBar("search-input-container", "searchInput", "dropdown", "clearBtn")
