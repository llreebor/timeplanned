// Initialize mobile menu and submenu functionality
function initializeMobile() {
	// Select main DOM elements for mobile menu
	const menu = document.querySelector("#mobile-menu")
	const overlay = document.querySelector("#mobile-menu-overlay")
	const burger = document.querySelector("#burger")
	const body = document.querySelector("body")

	// Define mobile breakpoint for responsive behavior
	const MOBILE_BREAKPOINT = 992

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

// Run initialization
initializeMobile()

// Dark theme toggle
const toggleMode = document.getElementById("toggle-mode")
toggleMode.addEventListener("click", () => {
	document.documentElement.classList.toggle("dark")
})

// Searchbar
function initSearchBar(containerId, inputId, dropdownId, clearBtnId) {
	const searchInput = document.getElementById(inputId)
	const dropdown = document.getElementById(dropdownId)
	const clearBtn = document.getElementById(clearBtnId)
	const container = document.getElementById(containerId)

	if (!searchInput || !dropdown || !clearBtn) {
		console.error("initSearchBar: один из элементов не найден")
		return
	}

	// Показывать dropdown при вводе
	searchInput.addEventListener("input", () => {
		if (searchInput.value.trim() !== "") {
			dropdown.classList.remove("hidden")
			clearBtn.classList.remove("hidden")
			container.classList.add("active")
		} else {
			dropdown.classList.add("hidden")
			clearBtn.classList.add("hidden")
			container.classList.remove("active")
		}
	})

	// Очистка инпута
	clearBtn.addEventListener("click", () => {
		searchInput.value = ""
		dropdown.classList.add("hidden")
		clearBtn.classList.add("hidden")
		container.classList.remove("active")
		searchInput.focus()
	})

	// Закрытие при клике вне
	document.addEventListener("click", (e) => {
		if (
			!e.target.closest(`#${inputId}`) &&
			!e.target.closest(`#${dropdownId}`)
		) {
			dropdown.classList.add("hidden")
			container.classList.remove("active")
		}
	})
}
initSearchBar("search-input-container", "searchInput", "dropdown", "clearBtn")
