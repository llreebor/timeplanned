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

function initCalendar({
	containerId,
	monthDisplayId,
	prevBtnId,
	nextBtnId,
	disabledDates,
}) {
	// Normalize disabledDates to 'YYYY-MM-DD' format for easier comparison
	disabledDates = disabledDates.map((date) => {
		const d = new Date(date)
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
	})

	// Get DOM elements
	const calendarDays = document.getElementById(containerId)
	const currentMonthEl = document.getElementById(monthDisplayId)
	const prevMonthBtn = document.getElementById(prevBtnId)
	const nextMonthBtn = document.getElementById(nextBtnId)

	// Get today’s date
	const today = new Date()
	let currentYear = today.getFullYear()
	let currentMonth = today.getMonth()
	let selectedDate = formatDate(currentYear, currentMonth, today.getDate())

	// Helper function to format a date as 'YYYY-MM-DD'
	function formatDate(year, month, day) {
		return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
	}

	// Render calendar for a given month and year
	function renderCalendar(year, month) {
		// Display current month and year in header
		currentMonthEl.textContent = new Date(year, month).toLocaleDateString(
			"en-US",
			{
				month: "long",
				year: "numeric",
			},
		)

		// Disable prev button if we are in the current or past month
		if (
			year < today.getFullYear() ||
			(year === today.getFullYear() && month <= today.getMonth())
		) {
			prevMonthBtn.disabled = true
		} else {
			prevMonthBtn.disabled = false
		}

		// Clear previous calendar days
		calendarDays.innerHTML = ""

		// Determine the weekday of the 1st day of the month
		const firstDay = new Date(year, month, 1).getDay()

		// Get number of days in the month
		const daysInMonth = new Date(year, month + 1, 0).getDate()

		// Calculate number of leading empty cells to align the first day
		const shift = firstDay === 0 ? 6 : firstDay - 1

		// Add empty cells at the beginning for alignment
		for (let i = 0; i < shift; i++) {
			const emptyCell = document.createElement("button")
			emptyCell.classList.add("text-transparent")
			calendarDays.appendChild(emptyCell)
		}

		// Generate day cells
		for (let day = 1; day <= daysInMonth; day++) {
			const dateStr = formatDate(year, month, day)
			const dayCell = document.createElement("div")
			dayCell.textContent = day
			dayCell.className = "datapicker-day-num"

			// Normalize cellDate and todayCopy to ignore time for comparison
			const cellDate = new Date(year, month, day)
			cellDate.setHours(0, 0, 0, 0)
			const todayCopy = new Date(today)
			todayCopy.setHours(0, 0, 0, 0)

			const isBeforeToday = cellDate < todayCopy
			const isDisabledByData = disabledDates.includes(dateStr)

			// Highlight the selected date
			if (selectedDate === dateStr) {
				dayCell.classList.add("selected")
			}

			// Disable dates before today or listed in disabledDates
			if (isBeforeToday || isDisabledByData) {
				dayCell.classList.add("disabled")
			} else {
				// Allow selecting available date
				dayCell.addEventListener("click", () => {
					selectedDate = dateStr
					renderCalendar(currentYear, currentMonth) // Re-render to update selection
				})
			}

			calendarDays.appendChild(dayCell)
		}
	}

	// Handle "Previous Month" button click
	prevMonthBtn.addEventListener("click", () => {
		if (currentMonth === 0) {
			currentMonth = 11
			currentYear--
		} else {
			currentMonth--
		}
		renderCalendar(currentYear, currentMonth)
	})

	// Handle "Next Month" button click
	nextMonthBtn.addEventListener("click", () => {
		if (currentMonth === 11) {
			currentMonth = 0
			currentYear++
		} else {
			currentMonth++
		}
		renderCalendar(currentYear, currentMonth)
	})

	// Initial render of the calendar
	renderCalendar(currentYear, currentMonth)
}

// Example init
initCalendar({
	containerId: "calendarDays",
	monthDisplayId: "currentMonth",
	prevBtnId: "prevMonth",
	nextBtnId: "nextMonth",
	disabledDates: ["2025-08-16", "2025-08-22"], // можно писать даже "2025-8-16"
})
