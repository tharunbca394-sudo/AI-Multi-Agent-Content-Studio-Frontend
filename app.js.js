"use strict";

// 1. Configuration
const HISTORY_STORAGE_KEY = "ai_content_studio_history";
const PREFERENCES_STORAGE_KEY = "ai_content_studio_preferences";
const AGENT_SEQUENCE = ["planner", "research", "writer", "reviewer", "editor"];
const DEFAULT_PROFILE = { name: "Tharun", role: "Student" };
const INTRO_SPEECH_PARTS = [
	"Hii! ",
	"Hello Guys! ",
	"I'm NOVA, your AI Multi-Agent. ",
	"Welcome to AI Multi-Agent Content Studio Website!"
];

function injectWelcomeStyles() {
	if (document.getElementById("welcomeScreenStyles")) return;
	const style = document.createElement("style");
	style.id = "welcomeScreenStyles";
	style.textContent = `
		.particle {
			position: absolute;
			border-radius: 9999px;
			background: radial-gradient(circle, rgba(103,232,249,0.9), rgba(59,130,246,0.25) 40%, transparent 70%);
			animation: particleFloat 17s ease-in-out infinite alternate;
			filter: blur(1px);
		}
		.particle-1 { width: 140px; height: 140px; left: 14%; top: 18%; animation-delay: 0s; }
		.particle-2 { width: 190px; height: 190px; right: 18%; top: 16%; animation-delay: 2s; }
		.particle-3 { width: 120px; height: 120px; left: 24%; bottom: 20%; animation-delay: 4s; }
		.particle-4 { width: 170px; height: 170px; right: 26%; bottom: 12%; animation-delay: 6s; }
		.particle-5 { width: 120px; height: 120px; left: 50%; top: 16%; transform: translateX(-50%); animation-delay: 8s; }
		.robot-shell { filter: drop-shadow(0 12px 32px rgba(34,211,238,0.24)); }
		.robot-arm, .robot-leg, #welcomeRobotHead {
			transform-box: fill-box;
			transform-origin: 50% 15%;
		}
		#welcomeRobotLegLeft, #welcomeRobotLegRight { transform-origin: 50% 8%; }
		#welcomeRobotArmLeft, #welcomeRobotArmRight { transform-origin: 50% 12%; }
		#welcomeRobotHead { transform-origin: 50% 85%; }
		#welcomeRobot.is-speaking #welcomeRobotMouth {
			transform-box: fill-box;
			transform-origin: center;
			animation: robotTalking 180ms ease-in-out infinite alternate;
		}
		.welcome-start-button {
			animation: welcomePulse 2.4s ease-in-out infinite;
		}
		@keyframes particleFloat {
			0% { transform: translate3d(0, 0, 0) scale(0.92); opacity: 0.45; }
			100% { transform: translate3d(18px, -24px, 0) scale(1.08); opacity: 0.9; }
		}
		@keyframes welcomePulse {
			0%, 100% { box-shadow: 0 0 16px rgba(34,211,238,0.18), 0 0 24px rgba(59,130,246,0.2); }
			50% { box-shadow: 0 0 18px rgba(34,211,238,0.3), 0 0 30px rgba(59,130,246,0.32); }
		}
		@keyframes robotTalking {
			from { transform: scaleY(0.65); }
			to { transform: scaleY(1.5); }
		}
	`;
	document.head.appendChild(style);
}

const THEME_CLASS_MAPS = {
	dark: {},
	light: {
		"bg-slate-950/90": "bg-white/95",
		"bg-slate-950/50": "bg-slate-50",
		"bg-slate-950": "bg-slate-100",
		"bg-slate-900/70": "bg-white",
		"bg-slate-900/60": "bg-white",
		"bg-slate-900/30": "bg-white",
		"bg-slate-900": "bg-slate-50",
		"border-slate-800": "border-slate-200",
		"border-slate-700": "border-slate-300",
		"text-white": "text-slate-950",
		"text-slate-100": "text-slate-900",
		"text-slate-200": "text-slate-800",
		"text-slate-300": "text-slate-700",
		"text-slate-400": "text-slate-600",
		"text-slate-500": "text-slate-500",
		"placeholder:text-slate-600": "placeholder:text-slate-500",
		"mix-blend-screen": "mix-blend-multiply",
		"opacity-[0.16]": "opacity-[0.16]",
		"btn-close-white": "btn-close"
	},
	ocean: {
		"bg-slate-950/90": "bg-blue-950/95",
		"bg-slate-950/50": "bg-blue-950/70",
		"bg-slate-950": "bg-blue-950",
		"bg-slate-900/70": "bg-blue-900/70",
		"bg-slate-900/60": "bg-blue-900/60",
		"bg-slate-900/30": "bg-blue-900/30",
		"bg-slate-900": "bg-blue-900",
		"border-slate-800": "border-blue-800",
		"border-slate-700": "border-blue-700",
		"text-cyan-400": "text-sky-300",
		"text-cyan-300": "text-sky-200",
		"text-cyan-200": "text-sky-100"
	},
	forest: {
		"bg-slate-950/90": "bg-green-950/95",
		"bg-slate-950/50": "bg-green-950/70",
		"bg-slate-950": "bg-green-950",
		"bg-slate-900/70": "bg-green-900/70",
		"bg-slate-900/60": "bg-green-900/60",
		"bg-slate-900/30": "bg-green-900/30",
		"bg-slate-900": "bg-green-900",
		"border-slate-800": "border-green-800",
		"border-slate-700": "border-green-700",
		"text-cyan-400": "text-emerald-300",
		"text-cyan-300": "text-emerald-200",
		"text-cyan-200": "text-emerald-100",
		"bg-cyan-400/10": "bg-emerald-400/10",
		"border-cyan-400/20": "border-emerald-400/20"
	},
	ember: {
		"bg-slate-950/90": "bg-stone-950/95",
		"bg-slate-950/50": "bg-stone-950/70",
		"bg-slate-950": "bg-stone-950",
		"bg-slate-900/70": "bg-stone-900/70",
		"bg-slate-900/60": "bg-stone-900/60",
		"bg-slate-900/30": "bg-stone-900/30",
		"bg-slate-900": "bg-stone-900",
		"border-slate-800": "border-stone-800",
		"border-slate-700": "border-stone-700",
		"text-cyan-400": "text-amber-300",
		"text-cyan-300": "text-amber-200",
		"text-cyan-200": "text-amber-100",
		"bg-cyan-400/10": "bg-amber-400/10",
		"border-cyan-400/20": "border-amber-400/20"
	}
};
const PAGE_TITLES = {
	dashboard: "Dashboard",
	create: "Create Content",
	processing: "AI Workflow",
	result: "Final Result",
	history: "History",
	compare: "Model Compare",
	settings: "Settings"
};
const TOAST_TYPES = ["success", "error", "warning", "info"];
const TOAST_CLASSES = {
	success: "border-success",
	error: "border-danger",
	warning: "border-warning",
	info: "border-info"
};
const AGENT_STATUS_CLASSES = {
	waiting: "text-bg-secondary",
	running: "text-bg-primary",
	completed: "text-bg-success",
	failed: "text-bg-danger"
};

// 2. Application State
const appState = {
	currentPage: "dashboard",
	currentRequest: null,
	currentResult: null,
	history: [],
	isGenerating: false,
	welcomeComplete: false
};
let currentProfile = { ...DEFAULT_PROFILE };
let audioContext = null;
let introAnimations = [];
let activeButtonClick = null;
let introSpeechSequence = 0;
let introGestureAnimations = [];
let activeIntroGesture = null;

// 3. DOM References
const dom = {};
let toastTimer = null;

function cacheDomReferences() {
	[
		"appShell", "welcomeScreen", "welcomeStartButton", "welcomeRobot", "welcomeRobotMotion", "welcomeRobotMouth", "welcomeRobotHead",
		"welcomeRobotArmLeft", "welcomeRobotArmRight", "welcomeRobotLegLeft", "welcomeRobotLegRight",
		"welcomeRobotHandFingersLeft", "welcomeRobotHandFingersRight",
		"welcomeRobotBody", "welcomeSpeechText", "welcomeSpeechBox",
		"sidebar", "menuButton", "pageTitle", "dashboardPage", "createPage",
		"processingPage", "resultPage", "historyPage", "comparePage", "settingsPage",
		"contentForm", "topic", "contentType", "platform", "audience", "tone",
		"language", "personalContext", "importantPoints", "cta", "recentList",
		"historyContainer", "resultContent", "resultType", "resultPlatform",
		"resultAudience", "resultTone", "resultLanguage", "copyButton", "saveButton",
		"improveButton", "translateButton", "imageButton", "voiceButton",
		"comparePrompt", "compareButton", "compareResults", "modelProvider",
		"defaultLanguage", "naturalContent", "themePreference", "profileButton",
		"profileAvatar", "profileName", "profileRole", "profileForm", "profileNameInput",
		"profileRoleInput", "deleteResultButton", "toast", "toastMessage"
	].forEach((id) => {
		dom[id] = document.getElementById(id);
	});
}

// 4. Navigation
function setNavigationItemActive(activePage) {
	document.querySelectorAll(".nav-item[data-page]").forEach((button) => {
		const isActive = button.dataset.page === activePage;
		button.classList.toggle("active", isActive);
		button.classList.toggle("border-cyan-400/20", isActive);
		button.classList.toggle("bg-cyan-400/10", isActive);
		button.classList.toggle("text-cyan-200", isActive);
		button.classList.toggle("border-transparent", !isActive);
		button.classList.toggle("text-slate-400", !isActive);
		button.querySelector(".nav-icon")?.classList.toggle("bg-cyan-300/10", isActive);
		button.setAttribute("aria-current", isActive ? "page" : "false");
	});
}

function closeMobileSidebar() {
	if (!dom.sidebar) return;

	if (window.bootstrap?.Offcanvas) {
		if (dom.sidebar.classList.contains("show")) {
			window.bootstrap.Offcanvas.getOrCreateInstance(dom.sidebar).hide();
		}
		return;
	}

	dom.sidebar.classList.remove("show");
	dom.menuButton?.setAttribute("aria-expanded", "false");
}

function navigateTo(page) {
	const pageElement = document.getElementById(`${page}Page`);
	if (!PAGE_TITLES[page] || !pageElement) {
		console.error(`Unknown page: ${page}`);
		showToast("That page is not available.", "error");
		return false;
	}

	document.querySelectorAll(".page").forEach((section) => {
		const isActive = section === pageElement;
		section.hidden = !isActive;
		section.classList.toggle("active", isActive);
	});

	appState.currentPage = page;
	if (dom.pageTitle) dom.pageTitle.textContent = PAGE_TITLES[page];
	setNavigationItemActive(page);
	closeMobileSidebar();
window.scrollTo({ top: 0, behavior: "smooth" });
	return true;
}

function ensureAudioContext() {
	const AudioCtor = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtor) return null;
	if (!audioContext) audioContext = new AudioCtor();
	return audioContext;
}

function playUiSound(type = "click") {
	if (activeButtonClick) activeButtonClick.soundPlayed = true;
	const context = ensureAudioContext();
	if (!context) return;
	if (context.state === "suspended") context.resume();

	const configMap = {
		click: { type: "triangle", start: 640, end: 440, duration: 0.1, volume: 0.03 },
		nav: { type: "sine", start: 310, end: 260, duration: 0.08, volume: 0.03 },
		success: { type: "triangle", start: 620, end: 880, duration: 0.15, volume: 0.04 },
		delete: { type: "sawtooth", start: 420, end: 180, duration: 0.18, volume: 0.04 },
		warning: { type: "square", start: 260, end: 180, duration: 0.14, volume: 0.03 },
		introWalk: { type: "square", start: 120, end: 88, duration: 0.09, volume: 0.016 },
		introChime: { type: "sine", start: 720, end: 980, duration: 0.2, volume: 0.04 }
	};
	const config = configMap[type] || configMap.click;
	const oscillator = context.createOscillator();
	const gain = context.createGain();
	oscillator.type = config.type;
	oscillator.frequency.setValueAtTime(config.start, context.currentTime);
	oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, config.end), context.currentTime + config.duration);
	gain.gain.setValueAtTime(config.volume, context.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + config.duration);
	oscillator.connect(gain);
	gain.connect(context.destination);
	oscillator.start(context.currentTime);
	oscillator.stop(context.currentTime + config.duration);
}

function updateWelcomeAppVisibility(visible) {
	const shell = dom.appShell;
	if (!shell) return;
	if (visible) {
		shell.classList.remove("opacity-0", "pointer-events-none");
		shell.style.visibility = "visible";
		return;
	}
	shell.classList.add("opacity-0", "pointer-events-none");
	shell.style.visibility = "hidden";
}

function stopSpeechSynthesis() {
	introSpeechSequence += 1;
	if (!("speechSynthesis" in window)) return;
	try {
		window.speechSynthesis.cancel();
	} catch (error) {
		console.warn("Speech synthesis could not be cancelled:", error);
	}
}

function pickIntroVoice() {
	if (!("speechSynthesis" in window)) return null;
	try {
		const voices = window.speechSynthesis.getVoices();
		const englishVoices = voices.filter((voice) => /^en/i.test(voice.lang));
		const preferred = englishVoices.find((voice) => /samantha|google|zira|aria|ava|jenny|daniel|olivia/i.test(voice.name));
		return preferred || englishVoices[0] || voices[0] || null;
	} catch (error) {
		console.warn("Could not select intro voice:", error);
		return null;
	}
}

function typeWelcomeText(message) {
	const speechText = dom.welcomeSpeechText;
	const speechBox = dom.welcomeSpeechBox;
	if (!speechText || !speechBox) return Promise.resolve();

	if (!speechText.textContent) {
		speechText.style.whiteSpace = "pre-line";
		speechBox.classList.remove("opacity-0");
		speechBox.classList.add("opacity-100");
	}

	return new Promise((resolve) => {
		let step = 0;
		const typingTimer = window.setInterval(() => {
			speechText.textContent += message[step];
			step += 1;
			if (step >= message.length) {
				window.clearInterval(typingTimer);
				resolve();
			}
			}, 38);
		});
}

function setIntroGesture(index, active) {
	const leftArm = dom.welcomeRobotArmLeft;
	const rightArm = dom.welcomeRobotArmRight;
	if (!rightArm) return;

	const clearGestureAnimations = () => {
		introGestureAnimations.forEach((animation) => animation.cancel());
		introGestureAnimations = [];
	};

	if (active) {
		if (index <= 1) {
			if (activeIntroGesture === 0) return;
			clearGestureAnimations();
			activeIntroGesture = 0;
			introGestureAnimations.push(rightArm.animate([
				{ transform: "rotate(0deg)" },
				{ transform: "rotate(-130deg)" }
			], { duration: 420, easing: "ease-out", fill: "forwards" }));
		}
		return;
	}

	if (index !== 1 || activeIntroGesture !== 0) return;
	clearGestureAnimations();
	activeIntroGesture = null;
	introGestureAnimations.push(rightArm.animate([
		{ transform: "rotate(-130deg)" },
		{ transform: "rotate(0deg)" }
	], { duration: 320, easing: "ease-in", fill: "forwards" }));
}

function speakIntroMessage() {
	stopSpeechSynthesis();
	const sequence = introSpeechSequence;
	const canSpeak = "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
	const selectedVoice = canSpeak ? pickIntroVoice() : null;

	const showTextWithoutVoice = async (index) => {
		if (sequence !== introSpeechSequence || index >= INTRO_SPEECH_PARTS.length) return;
		setIntroGesture(index, true);
		await typeWelcomeText(INTRO_SPEECH_PARTS[index]);
		setIntroGesture(index, false);
		if (sequence === introSpeechSequence) {
			window.setTimeout(() => showTextWithoutVoice(index + 1), 180);
		}
	};

	const speakPart = async (index, useVoice) => {
		if (sequence !== introSpeechSequence || index >= INTRO_SPEECH_PARTS.length) {
			dom.welcomeRobot?.classList.remove("is-speaking");
			return;
		}
		if (!useVoice) {
			await showTextWithoutVoice(index);
			return;
		}

		try {
			const utterance = new window.SpeechSynthesisUtterance(INTRO_SPEECH_PARTS[index].trim());
			if (selectedVoice) utterance.voice = selectedVoice;
			utterance.lang = "en-US";
			utterance.rate = 0.95;
			utterance.pitch = 1.08;
			utterance.volume = 1;
			let typingPromise;
			utterance.onstart = () => {
				if (sequence !== introSpeechSequence) return;
				dom.welcomeRobot?.classList.add("is-speaking");
				setIntroGesture(index, true);
				typingPromise = typeWelcomeText(INTRO_SPEECH_PARTS[index]);
			};
			utterance.onend = async () => {
				if (sequence !== introSpeechSequence) return;
				if (typingPromise) await typingPromise;
				else await typeWelcomeText(INTRO_SPEECH_PARTS[index]);
				setIntroGesture(index, false);
				speakPart(index + 1, true);
			};
			utterance.onerror = async () => {
				if (sequence !== introSpeechSequence) return;
				dom.welcomeRobot?.classList.remove("is-speaking");
				setIntroGesture(index, false);
				if (typingPromise) await typingPromise;
				else await typeWelcomeText(INTRO_SPEECH_PARTS[index]);
				speakPart(index + 1, false);
			};
			window.speechSynthesis.speak(utterance);
		} catch (error) {
			dom.welcomeRobot?.classList.remove("is-speaking");
			console.warn("Speech synthesis is unavailable or blocked:", error);
			showTextWithoutVoice(index);
		}
	};

	void speakPart(0, canSpeak);
}

function stopIntroAnimations() {
	introAnimations.forEach((animation) => {
		if (animation && typeof animation.cancel === "function") animation.cancel();
	});
	introAnimations = [];
}

function animateIntroRobot() {
	const robot = dom.welcomeRobot;
	const motion = dom.welcomeRobotMotion;
	const head = dom.welcomeRobotHead;
	const leftArm = dom.welcomeRobotArmLeft;
	const rightArm = dom.welcomeRobotArmRight;
	const leftLeg = dom.welcomeRobotLegLeft;
	const rightLeg = dom.welcomeRobotLegRight;
	if (!robot) return;

	stopIntroAnimations();
	robot.classList.remove("opacity-0");
	robot.style.opacity = "1";
	const startOffset = Math.ceil(window.innerWidth / 2 + robot.offsetWidth / 2);
	robot.style.transform = `translateX(-${startOffset}px)`;
	const walk = robot.animate([
		{ transform: `translateX(-${startOffset}px) translateY(0)` },
		{ transform: `translateX(-${Math.round(startOffset * 0.7)}px) translateY(-8px)`, offset: 0.28 },
		{ transform: `translateX(-${Math.round(startOffset * 0.38)}px) translateY(0)`, offset: 0.62 },
		{ transform: `translateX(-${Math.round(startOffset * 0.12)}px) translateY(-5px)`, offset: 0.86 },
		{ transform: "translateX(0) translateY(0)" }
	], { duration: 2700, easing: "cubic-bezier(0.2, 0.72, 0.25, 1)", fill: "forwards" });
	introAnimations.push(walk);

	const bodyMotion = motion?.animate([
		{ transform: "translateY(0)" },
		{ transform: "translateY(-7px)" },
		{ transform: "translateY(0)" }
	], { duration: 520, iterations: Infinity, easing: "ease-in-out" });
	if (bodyMotion) introAnimations.push(bodyMotion);

	const headMotion = head?.animate([
		{ transform: "rotate(0deg)" },
		{ transform: "rotate(-3deg)" },
		{ transform: "rotate(0deg)" }
	], { duration: 900, iterations: Infinity, easing: "ease-in-out" });
	if (headMotion) introAnimations.push(headMotion);

	const leftArmMotion = leftArm?.animate([
		{ transform: "rotate(20deg)" },
		{ transform: "rotate(-18deg)" },
		{ transform: "rotate(20deg)" }
	], { duration: 520, iterations: Infinity, easing: "ease-in-out" });
	if (leftArmMotion) introAnimations.push(leftArmMotion);

	const rightArmMotion = rightArm?.animate([
		{ transform: "rotate(-20deg)" },
		{ transform: "rotate(18deg)" },
		{ transform: "rotate(-20deg)" }
	], { duration: 520, iterations: Infinity, easing: "ease-in-out" });
	if (rightArmMotion) introAnimations.push(rightArmMotion);

	const leftLegMotion = leftLeg?.animate([
		{ transform: "rotate(18deg)" },
		{ transform: "rotate(-18deg)" },
		{ transform: "rotate(18deg)" }
	], { duration: 520, iterations: Infinity, easing: "ease-in-out" });
	if (leftLegMotion) introAnimations.push(leftLegMotion);

	const rightLegMotion = rightLeg?.animate([
		{ transform: "rotate(-18deg)" },
		{ transform: "rotate(18deg)" },
		{ transform: "rotate(-18deg)" }
	], { duration: 520, iterations: Infinity, easing: "ease-in-out" });
	if (rightLegMotion) introAnimations.push(rightLegMotion);

	playUiSound("introWalk");
	walk.onfinish = () => {
		stopIntroAnimations();
		robot.style.transform = "translateX(0)";
		robot.animate([
			{ transform: "translateY(0)" },
			{ transform: "translateY(-3px)" },
			{ transform: "translateY(0)" }
		], { duration: 1500, iterations: Infinity, easing: "ease-in-out" });
		head?.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(0deg)" }], { duration: 2600, iterations: Infinity, easing: "ease-in-out" });
		playUiSound("introChime");
		speakIntroMessage();
		if (dom.welcomeStartButton) {
			dom.welcomeStartButton.classList.remove("opacity-0", "pointer-events-none");
			dom.welcomeStartButton.classList.add("opacity-100");
		}
	};
}

function dismissWelcomeExperience() {
	playUiSound("click");
	stopSpeechSynthesis();
	if (dom.welcomeScreen) {
		dom.welcomeScreen.style.opacity = "0";
		dom.welcomeScreen.style.transform = "scale(1.05)";
		dom.welcomeScreen.style.pointerEvents = "none";
	}
	updateWelcomeAppVisibility(true);
	window.setTimeout(() => {
		appState.welcomeComplete = true;
		if (dom.welcomeScreen) dom.welcomeScreen.style.display = "none";
		navigateTo("dashboard");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, 620);
}

function setupWelcomeExperience() {
	if (!dom.welcomeScreen || !dom.appShell) return;
	appState.welcomeComplete = false;
	updateWelcomeAppVisibility(false);
	if (dom.welcomeStartButton) {
		dom.welcomeStartButton.addEventListener("click", dismissWelcomeExperience);
	}
	window.setTimeout(() => {
		animateIntroRobot();
	}, 280);
}

function setupNavigation() {
	document.querySelectorAll("[data-page]").forEach((control) => {
		control.addEventListener("click", (event) => {
			event.preventDefault();
			playUiSound(control.dataset.page ? "nav" : "click");
			navigateTo(control.dataset.page);
		});
	});
}

function setupButtonClickSounds() {
	document.addEventListener("click", (event) => {
		if (!event.target.closest("button, [role='button'], a[href]")) return;
		const click = { soundPlayed: false };
		activeButtonClick = click;
		window.setTimeout(() => {
			if (!click.soundPlayed) playUiSound("click");
			if (activeButtonClick === click) activeButtonClick = null;
		}, 0);
	}, true);
}

// 5. Mobile Menu
function setupMobileMenu() {
	if (!dom.sidebar || !dom.menuButton) return;

	dom.sidebar.addEventListener("shown.bs.offcanvas", () => {
		dom.menuButton.setAttribute("aria-expanded", "true");
	});
	dom.sidebar.addEventListener("hidden.bs.offcanvas", () => {
		dom.menuButton.setAttribute("aria-expanded", "false");
	});

	dom.menuButton.addEventListener("click", () => {
		if (window.bootstrap?.Offcanvas) return;
		const isOpen = dom.sidebar.classList.toggle("show");
		dom.menuButton.setAttribute("aria-expanded", String(isOpen));
	});
}

// 6. Quick Create
function setupQuickCreate() {
	document.querySelectorAll("[data-content-type]").forEach((card) => {
		card.addEventListener("click", () => {
			playUiSound("click");
			const selectedType = card.dataset.contentType;
			if (!dom.contentType) return;

			const matchingOption = Array.from(dom.contentType.options).find((option) => option.value === selectedType || option.textContent.trim() === selectedType);
			if (!matchingOption) {
				showToast("That content type is not available in the form.", "warning");
				navigateTo("create");
				return;
			}

			dom.contentType.value = matchingOption.value;
			navigateTo("create");
			dom.topic?.focus();
		});
	});
}

// 7. Form Handling
function collectFormRequest() {
	if (!dom.contentForm) return null;
	const formData = new FormData(dom.contentForm);
	return {
		topic: String(formData.get("topic") || "").trim(),
		contentType: String(formData.get("contentType") || "").trim(),
		platform: String(formData.get("platform") || "").trim(),
		audience: String(formData.get("audience") || "").trim(),
		tone: String(formData.get("tone") || "").trim(),
		language: String(formData.get("language") || "").trim(),
		personalContext: String(formData.get("personalContext") || "").trim(),
		importantPoints: String(formData.get("importantPoints") || "").trim(),
		cta: String(formData.get("cta") || "").trim()
	};
}

function setupFormHandling() {
	if (!dom.contentForm) {
		console.error("The content form was not found.");
		return;
	}
	dom.topic?.addEventListener("invalid", () => {
		showToast("Please enter a topic or idea.", "error");
		dom.topic.focus();
	});

	dom.contentForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		playUiSound("click");
		const request = collectFormRequest();
		if (!request?.topic) {
			showToast("Please enter a topic or idea.", "error");
			dom.topic?.focus();
			return;
		}
		if (appState.isGenerating) return;

		appState.currentRequest = request;
		const submitButton = dom.contentForm.querySelector('[type="submit"]');
		setButtonLoading(submitButton, true, "Running demo workflow...");
		try {
			await runDemoWorkflow(request);
		} catch (error) {
			console.error("Demo workflow failed:", error);
			showToast("The demo workflow could not be completed.", "error");
			navigateTo("create");
		} finally {
			appState.isGenerating = false;
			setButtonLoading(submitButton, false);
		}
	});

	const clearButton = dom.contentForm.querySelector("#clearForm, button[type='reset']");
	clearButton?.addEventListener("click", () => {
		appState.currentRequest = null;
		showToast("Form cleared", "info");
	});
}

// 8. Demo Agent Workflow
function waitForDemoStep() {
	return new Promise((resolve) => setTimeout(resolve, 650));
}

function resetAgentStatuses() {
	AGENT_SEQUENCE.forEach((agentName) => updateAgentStatus(agentName, "waiting"));
}

async function runDemoWorkflow(request) {
	if (!request?.topic) throw new Error("A topic is required to start the demo workflow.");
	appState.isGenerating = true;
	resetAgentStatuses();
	navigateTo("processing");

	for (const agentName of AGENT_SEQUENCE) {
		updateAgentStatus(agentName, "running");
		await waitForDemoStep();
		updateAgentStatus(agentName, "completed");
	}

	const content = generateDemoContent(request);
	appState.currentResult = { ...request, content, createdAt: new Date().toISOString() };
	updateResultPage(appState.currentResult);
	const generationCount = Number(document.getElementById("totalGenerations")?.textContent || 0) + 1;
	const generationCounter = document.getElementById("totalGenerations");
	if (generationCounter) generationCounter.textContent = String(generationCount);
	navigateTo("result");
	showToast("Demo workflow completed", "success");
}

function updateAgentStatus(agentName, status) {
	const allowedStatuses = ["waiting", "running", "completed", "failed"];
	const agentCard = document.querySelector(`[data-agent="${agentName}"]`);
	const statusElement = agentCard?.querySelector("[data-agent-status]");
	if (!allowedStatuses.includes(status) || !statusElement) {
		if (!allowedStatuses.includes(status)) console.error(`Unsupported agent status: ${status}`);
		return false;
	}

	statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
	statusElement.className = `agent-status badge rounded-pill ${AGENT_STATUS_CLASSES[status]}`;
	agentCard.setAttribute("aria-label", `${agentName} agent: ${status}`);
	return true;
}

// 9. Demo Content Generation
function generateDemoContent(request) {
	// Frontend demo only. Replace with real AI backend later.
	const topic = request.topic.trim().replace(/[.!?]+$/, "");
	const type = request.contentType || "General Social Media Content";
	const audience = request.audience || "General Audience";
	const tone = request.tone || "Professional";
	const platform = request.platform || "General";
	const points = request.importantPoints
		.split(/\n+/)
		.map((point) => point.replace(/^\s*[-*•\d.]+\s*/, "").trim())
		.filter(Boolean);
	const pointList = points.length ? points.map((point) => `• ${point}`).join("\n") : "";
	const context = request.personalContext.trim();
	const contextLine = context ? `\n\nPersonal context: ${context}` : "";
	const pointsSection = pointList ? `\n\nKey points\n${pointList}` : "";
	const cta = request.cta.trim();
	const actionLine = cta ? `\n\n${cta}` : "";
	const toneLine = `Tone: ${tone}`;
	const platformLine = `Platform: ${platform}`;
	let draft;

	switch (type) {
		case "LinkedIn Post":
			draft = `${topic}\n\nThere is more to this idea than a headline. For ${audience.toLowerCase()}, the useful question is how ${topic.toLowerCase()} can make a real difference in the way we think, work, or create.\n\nA thoughtful next step is to understand the challenge, share practical perspectives, and keep learning from the people closest to it.${contextLine}${pointsSection}${actionLine}`;
			break;
		case "Instagram Caption":
			draft = `${topic}\n\nSmall idea, meaningful conversation. ${topic} is worth exploring with curiosity, an open mind, and a focus on what can be learned along the way.${contextLine}${pointsSection}${actionLine}\n\n#${topic.split(/\s+/).slice(0, 3).map((word) => word.replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean).join("")} #KeepCreating`;
			break;
		case "Blog Article":
			draft = `${topic}\n\nIntroduction\n${topic} raises an important question for ${audience.toLowerCase()}: what should we understand before deciding what to do next? This article lays out a clear starting point and practical areas to consider.\n\nWhy this topic matters\nA useful discussion begins by defining the problem, identifying who it affects, and separating verified information from assumptions. That makes it easier to evaluate possible approaches without overstating what is known.\n\nPoints to consider\n${pointList || `• Clarify the goal behind ${topic.toLowerCase()}.\n• Consider the needs and perspectives of ${audience.toLowerCase()}.\n• Identify a practical next step and how its outcome could be evaluated.`}\n\nA practical next step\nStart with one specific question about ${topic.toLowerCase()}, gather reliable context, and use that to guide the next decision.${contextLine}${actionLine}`;
			break;
		case "Short Video Script":
			draft = `SHORT VIDEO SCRIPT: ${topic}\n\n[Opening]\n"Have you been thinking about ${topic.toLowerCase()}? Here is a simple place to start."\n\n[Main point]\n"First, be clear about the problem you want to solve. Then look at the details that matter to ${audience.toLowerCase()}, and choose one practical next step. Keep the message focused on what you know and what still needs to be explored."\n\n[Close]\n"That is one way to approach ${topic.toLowerCase()}."${contextLine}${pointsSection}${actionLine}`;
			break;
		case "Product Description":
			draft = `${topic}\n\nA clear introduction to ${topic.toLowerCase()}, made for ${audience.toLowerCase()}. Use this description to explain what it is, who it is intended for, and the specific value it offers without promising features that have not been confirmed.${contextLine}${pointsSection}${actionLine}`;
			break;
		case "Professional Email":
			draft = `Subject: Regarding ${topic}\n\nHello,\n\nI am reaching out about ${topic.toLowerCase()}. I would like to share the relevant details and understand the best next step.\n\n${points.length ? `For reference:\n${pointList}\n\n` : ""}${context ? `${context}\n\n` : ""}${cta ? `${cta}\n\n` : ""}Thank you for your time.\n\nBest regards`;
			break;
		case "Announcement":
			draft = `ANNOUNCEMENT\n\nWe are pleased to share an update about ${topic.toLowerCase()}. This announcement is for ${audience.toLowerCase()} and is intended to make the key information easy to understand.\n\nWhat to know\n${pointList || `• Topic: ${topic}\n• Audience: ${audience}\n• Next step: share confirmed details and where to find updates.`}${contextLine}${actionLine}`;
			break;
		default:
			draft = `${topic}\n\nA clear starting point for discussing ${topic.toLowerCase()} with ${audience.toLowerCase()}. Focus on the main idea, why it matters to the people reading, and one practical action they can take next.${contextLine}${pointsSection}${actionLine}`;
	}

	const languageNotice = request.language && request.language !== "English"
		? `\n\nLanguage preference: ${request.language}. This frontend draft uses English wording; real translation will be available after backend integration.`
		: "";
	return `[Frontend demo draft · template-based]\n${platformLine} · ${toneLine}\n\n${draft}${languageNotice}\n\n[Demo draft only. No AI model or external research was used.]`;
}

// 10. Result Rendering
function updateResultPage(result) {
	if (!result || typeof result.content !== "string") {
		showToast("There is no result to display.", "warning");
		return false;
	}

	if (dom.resultContent) dom.resultContent.value = result.content;
	if (dom.resultType) dom.resultType.textContent = result.contentType || "Content";
	if (dom.resultPlatform) dom.resultPlatform.textContent = result.platform || "—";
	if (dom.resultAudience) dom.resultAudience.textContent = result.audience || "—";
	if (dom.resultTone) dom.resultTone.textContent = result.tone || "—";
	if (dom.resultLanguage) dom.resultLanguage.textContent = result.language || "—";
	return true;
}

function getCurrentEditorContent() {
	return dom.resultContent?.value.trim() || "";
}

// 11. Copy
function setupCopyButton() {
	dom.copyButton?.addEventListener("click", async () => {
		const content = getCurrentEditorContent();
		if (!content) {
			showToast("There is no content to copy.", "warning");
			return;
		}
		try {
			if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable.");
			await navigator.clipboard.writeText(content);
			showToast("Content copied to clipboard", "success");
		} catch (error) {
			console.error("Clipboard copy failed:", error);
			showToast("Unable to copy content", "error");
		}
	});
}

// 12. Save
function makeHistoryId() {
	return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function persistHistory() {
	try {
		localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(appState.history));
		return true;
	} catch (error) {
		console.error("Could not save content history:", error);
		showToast("Unable to save content in this browser.", "error");
		return false;
	}
}

function saveCurrentContent() {
	const content = getCurrentEditorContent();
	if (!content) {
		showToast("There is no content to save.", "warning");
		return false;
	}
	const request = appState.currentResult || appState.currentRequest || {};
	const entry = {
		id: request.id || makeHistoryId(),
		topic: request.topic || content.split("\n").find(Boolean) || "Untitled content",
		content,
		contentType: dom.resultType?.textContent || request.contentType || "Content",
		platform: dom.resultPlatform?.textContent || request.platform || "General",
		audience: dom.resultAudience?.textContent || request.audience || "General Audience",
		tone: dom.resultTone?.textContent || request.tone || "Professional",
		language: dom.resultLanguage?.textContent || request.language || "English",
		createdAt: new Date().toISOString()
	};

	const existingIndex = appState.history.findIndex((item) => item.id === entry.id);
	const previousEntry = existingIndex >= 0 ? appState.history[existingIndex] : null;
	if (existingIndex >= 0) appState.history[existingIndex] = entry;
	else appState.history.unshift(entry);
	if (!persistHistory()) {
		if (existingIndex >= 0) appState.history[existingIndex] = previousEntry;
		else appState.history.shift();
		return false;
	}
	appState.currentResult = { ...entry };
	renderHistory();
	renderRecentContent();
	updateSavedCount();
	showToast("Content saved", "success");
	return true;
}

function setupSaveButton() {
	dom.saveButton?.addEventListener("click", saveCurrentContent);
}

function deleteCurrentResult() {
	if (!dom.resultContent?.value.trim()) {
		showToast("There is no result to delete.", "warning");
		return;
	}

	const currentId = appState.currentResult?.id;
	if (currentId) {
		const previousHistory = appState.history;
		appState.history = appState.history.filter((item) => item.id !== currentId);
		if (appState.history.length !== previousHistory.length && !persistHistory()) {
			appState.history = previousHistory;
			return;
		}
		renderHistory();
		renderRecentContent();
		updateSavedCount();
	}

	appState.currentResult = null;
	appState.currentRequest = null;
	dom.resultContent.value = "";
	if (dom.resultType) dom.resultType.textContent = "LinkedIn Post";
	[dom.resultPlatform, dom.resultAudience, dom.resultTone, dom.resultLanguage].forEach((field) => {
		if (field) field.textContent = "—";
	});
	navigateTo("create");
	showToast(currentId ? "Saved result deleted" : "Result deleted", "success");
}

function setupDeleteResultButton() {
	dom.deleteResultButton?.addEventListener("click", deleteCurrentResult);
}

// 13. History
function loadHistory() {
	try {
		const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
		const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
		appState.history = Array.isArray(parsedHistory)
			? parsedHistory.filter((item) => item && typeof item.id === "string" && typeof item.content === "string")
			: [];
	} catch (error) {
		console.error("Could not load saved content:", error);
		appState.history = [];
		showToast("Saved content could not be loaded.", "warning");
	}
	renderHistory();
	updateSavedCount();
}

function formatDate(dateValue) {
	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) return "Date unavailable";
	return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function createHistoryCard(entry) {
	const card = document.createElement("article");
	card.className = "card mb-3 border-secondary bg-dark text-light";
	const body = document.createElement("div");
	body.className = "card-body d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3";
	const details = document.createElement("div");
	details.className = "min-w-0";
	const title = document.createElement("h3");
	title.className = "h6 mb-2 text-break";
	title.textContent = entry.topic || "Untitled content";
	const metadata = document.createElement("p");
	metadata.className = "mb-0 small text-white-50";
	metadata.textContent = `${entry.contentType || "Content"} · ${entry.platform || "General"} · ${formatDate(entry.createdAt)}`;
	const actions = document.createElement("div");
	actions.className = "d-flex flex-wrap gap-2 flex-shrink-0";
	const openButton = document.createElement("button");
	openButton.type = "button";
	openButton.className = "btn btn-sm btn-outline-info";
	openButton.dataset.historyAction = "open";
	openButton.dataset.historyId = entry.id;
	openButton.textContent = "Open";
	const deleteButton = document.createElement("button");
	deleteButton.type = "button";
	deleteButton.className = "btn btn-sm btn-outline-danger";
	deleteButton.dataset.historyAction = "delete";
	deleteButton.dataset.historyId = entry.id;
	deleteButton.textContent = "Delete";
	details.append(title, metadata);
	actions.append(openButton, deleteButton);
	body.append(details, actions);
	card.append(body);
	return card;
}

function renderHistory() {
	if (!dom.historyContainer) return;
	if (appState.history.length === 0) {
		dom.historyContainer.innerHTML = '<div class="empty-state flex flex-col items-center px-5 py-16 text-center"><span class="empty-icon mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl text-cyan-300" aria-hidden="true">◷</span><h3 class="mb-2 text-base font-semibold text-slate-200">No saved content</h3><p class="mb-0 text-sm text-slate-500">Generate and save content to see it here.</p></div>';
		return;
	}
	const fragment = document.createDocumentFragment();
	appState.history.forEach((entry) => fragment.append(createHistoryCard(entry)));
	dom.historyContainer.replaceChildren(fragment);
}

function setupHistoryActions() {
	dom.historyContainer?.addEventListener("click", (event) => {
		const button = event.target.closest("[data-history-action]");
		if (!button) return;
		const entry = appState.history.find((item) => item.id === button.dataset.historyId);
		if (!entry) {
			showToast("That saved item could not be found.", "error");
			return;
		}

		if (button.dataset.historyAction === "open") {
			playUiSound("nav");
			appState.currentResult = { ...entry };
			appState.currentRequest = { ...entry };
			updateResultPage(entry);
			navigateTo("result");
		} else if (button.dataset.historyAction === "delete") {
			playUiSound("delete");
			appState.history = appState.history.filter((item) => item.id !== entry.id);
			if (persistHistory()) {
				renderHistory();
				renderRecentContent();
				updateSavedCount();
				showToast("Saved content deleted", "success");
			}
		}
	});
}

function updateSavedCount() {
	const counter = document.getElementById("savedContent");
	if (counter) counter.textContent = String(appState.history.length);
}

// 14. Recent Content
function renderRecentContent() {
	if (!dom.recentList) return;
	if (appState.history.length === 0) {
		dom.recentList.innerHTML = '<div class="empty-state flex flex-col items-center px-5 py-12 text-center"><span class="empty-icon mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl text-slate-400" aria-hidden="true">◷</span><h3 class="mb-2 text-base font-semibold text-slate-200">No content yet</h3><p class="mb-0 text-sm text-slate-500">Your generated content will appear here.</p></div>';
		return;
	}

	const list = document.createElement("div");
	list.className = "divide-y divide-secondary";
	appState.history.slice(0, 4).forEach((entry) => {
		const row = document.createElement("article");
		row.className = "d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 p-4";
		const details = document.createElement("div");
		details.className = "min-w-0";
		const title = document.createElement("h3");
		title.className = "h6 mb-1 text-break text-light";
		title.textContent = entry.topic || "Untitled content";
		const metadata = document.createElement("p");
		metadata.className = "mb-0 small text-white-50";
		metadata.textContent = `${entry.contentType || "Content"} · ${entry.platform || "General"} · ${formatDate(entry.createdAt)}`;
		const openButton = document.createElement("button");
		openButton.type = "button";
		openButton.className = "btn btn-sm btn-outline-info flex-shrink-0";
		openButton.dataset.historyAction = "open";
		openButton.dataset.historyId = entry.id;
		openButton.textContent = "Open";
		details.append(title, metadata);
		row.append(details, openButton);
		list.append(row);
	});
	dom.recentList.replaceChildren(list);
}

// 15. Improve
function setupImproveButton() {
	dom.improveButton?.addEventListener("click", () => {
		playUiSound("success");
		showToast("AI improvement will be connected after backend integration.", "info");
	});
}

// 16. Translate
function setupTranslateButton() {
	dom.translateButton?.addEventListener("click", () => {
		playUiSound("nav");
		showToast("Translation API will be connected in the backend stage.", "info");
	});
}

// 17. Image
function setupImageButton() {
	dom.imageButton?.addEventListener("click", () => {
		playUiSound("success");
		showToast("Image generation will be connected in the backend stage.", "info");
	});
}

// 18. Voice
function setupVoiceButton() {
	dom.voiceButton?.addEventListener("click", () => {
		playUiSound("success");
		showToast("Voice generation will be connected in the backend stage.", "info");
	});
}

// 19. Model Compare
function setupModelCompare() {
	dom.compareButton?.addEventListener("click", () => {
		playUiSound("click");
		if (!dom.comparePrompt?.value.trim()) {
			showToast("Please enter a prompt first.", "warning");
			dom.comparePrompt?.focus();
			return;
		}

		const message = document.createElement("p");
		message.className = "col-span-full mb-0 rounded-xl border border-info border-opacity-25 bg-dark p-4 text-center text-info";
		message.textContent = "Model comparison will be available after AI API integration.";
		dom.compareResults?.replaceChildren(message);
		showToast("Model comparison is not connected yet.", "info");
	});
}

// 20. Settings
function loadPreferences() {
	try {
		const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
		const preferences = stored ? JSON.parse(stored) : {};
		if (preferences && typeof preferences === "object") {
			setSelectIfValid(dom.modelProvider, preferences.modelProvider);
			setSelectIfValid(dom.defaultLanguage, preferences.defaultLanguage);
			setSelectIfValid(dom.themePreference, preferences.theme || "dark");
			if (dom.naturalContent && typeof preferences.naturalContent === "boolean") {
				dom.naturalContent.checked = preferences.naturalContent;
			}
			if (preferences.profile && typeof preferences.profile === "object") {
				currentProfile = {
					name: String(preferences.profile.name || DEFAULT_PROFILE.name).slice(0, 60),
					role: String(preferences.profile.role || DEFAULT_PROFILE.role).slice(0, 60)
				};
			}
		}
	} catch (error) {
		console.error("Could not load preferences:", error);
		showToast("Preferences could not be loaded.", "warning");
	}
	updateProfileDisplay();
	applyTheme(dom.themePreference?.value || "dark");
}

function setSelectIfValid(select, value) {
	if (!select || typeof value !== "string") return;
	if (Array.from(select.options).some((option) => option.value === value || option.textContent.trim() === value)) {
		select.value = value;
	}
}

function savePreferences() {
	const preferences = {
		modelProvider: dom.modelProvider?.value || "Gemini",
		defaultLanguage: dom.defaultLanguage?.value || "English",
		naturalContent: Boolean(dom.naturalContent?.checked),
		theme: dom.themePreference?.value || "dark",
		profile: { ...currentProfile }
	};
	try {
		localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
		playUiSound("success");
		showToast("Settings saved", "success");
		return true;
	} catch (error) {
		console.error("Could not save preferences:", error);
		showToast("Unable to save settings in this browser.", "error");
		return false;
	}
}

function setupSettings() {
	[dom.modelProvider, dom.defaultLanguage, dom.naturalContent].forEach((control) => {
		control?.addEventListener("change", savePreferences);
	});
	dom.themePreference?.addEventListener("change", () => {
		applyTheme(dom.themePreference.value);
		savePreferences();
	});
	dom.profileForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		playUiSound("click");
		const name = dom.profileNameInput?.value.trim();
		if (!name) {
			showToast("Please enter your name.", "warning");
			dom.profileNameInput?.focus();
			return;
		}
		currentProfile = {
			name: name.slice(0, 60),
			role: dom.profileRoleInput?.value.trim().slice(0, 60) || "Member"
		};
		updateProfileDisplay();
		if (savePreferences()) {
			window.bootstrap?.Modal.getOrCreateInstance(document.getElementById("profileModal")).hide();
			showToast("Profile saved", "success");
		}
	});
	document.getElementById("profileModal")?.addEventListener("show.bs.modal", () => {
		if (dom.profileNameInput) dom.profileNameInput.value = currentProfile.name;
		if (dom.profileRoleInput) dom.profileRoleInput.value = currentProfile.role;
	});
}

function updateProfileDisplay() {
	if (dom.profileName) dom.profileName.textContent = currentProfile.name;
	if (dom.profileRole) dom.profileRole.textContent = currentProfile.role;
	if (dom.profileAvatar) dom.profileAvatar.textContent = currentProfile.name.trim().charAt(0).toUpperCase() || "U";
	dom.profileButton?.setAttribute("aria-label", `Edit profile for ${currentProfile.name}`);
}

function applyTheme(theme) {
	const selectedTheme = Object.prototype.hasOwnProperty.call(THEME_CLASS_MAPS, theme) ? theme : "dark";
	document.documentElement.dataset.theme = selectedTheme;
	document.body.dataset.theme = selectedTheme;
	const replacements = THEME_CLASS_MAPS[selectedTheme];
	document.querySelectorAll("[class]").forEach((element) => {
		const currentClasses = element instanceof SVGElement
			? element.getAttribute("class") || ""
			: element.className;
		if (!element.dataset.baseThemeClasses) element.dataset.baseThemeClasses = currentClasses;
		const themedClasses = element.dataset.baseThemeClasses
			.split(/\s+/)
			.filter(Boolean)
			.map((className) => replacements[className] || className);
		const updatedClasses = [...new Set(themedClasses)].join(" ");
		if (element instanceof SVGElement) {
			element.setAttribute("class", updatedClasses);
		} else {
			element.className = updatedClasses;
		}
	});
	setNavigationItemActive(appState.currentPage);
}

// 21. Toast
function showToast(message, type = "info") {
	if (!dom.toast || !dom.toastMessage) {
		console.warn(message);
		return;
	}
	const normalizedType = TOAST_TYPES.includes(type) ? type : "info";
	Object.values(TOAST_CLASSES).forEach((className) => dom.toast.classList.remove(className));
	dom.toast.classList.add(TOAST_CLASSES[normalizedType]);
	dom.toastMessage.textContent = String(message);
	dom.toast.hidden = false;
	if (toastTimer) window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => {
		dom.toast.hidden = true;
	}, 3800);
}

// 22. Loading States
function setButtonLoading(button, loading, loadingText = "Working...") {
	if (!button) return;
	if (loading) {
		if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
		button.disabled = true;
		button.setAttribute("aria-busy", "true");
		button.textContent = loadingText;
		return;
	}
	if (button.dataset.originalHtml) {
		button.innerHTML = button.dataset.originalHtml;
		delete button.dataset.originalHtml;
	}
	button.disabled = false;
	button.removeAttribute("aria-busy");
}

// 23. Initialization
function init() {
	injectWelcomeStyles();
	cacheDomReferences();
	setupWelcomeExperience();
	setupButtonClickSounds();
	setupNavigation();
	setupMobileMenu();
	setupQuickCreate();
	setupFormHandling();
	setupCopyButton();
	setupSaveButton();
	setupDeleteResultButton();
	setupHistoryActions();
	setupImproveButton();
	setupTranslateButton();
	setupImageButton();
	setupVoiceButton();
	setupModelCompare();
	setupSettings();
	loadPreferences();
	loadHistory();
	renderRecentContent();
	if (appState.welcomeComplete) {
		navigateTo("dashboard");
	}
}

document.addEventListener("DOMContentLoaded", init);