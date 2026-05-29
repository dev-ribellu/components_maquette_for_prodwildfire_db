const imagePairs = [
	{ name: "Image 1", back: "assets/images_components_superpo/image_1_ir.png", front: "assets/images_components_superpo/image_1_brut.png" },
	{ name: "Image 2", back: "assets/images_components_superpo/image_2_ir.png", front: "assets/images_components_superpo/image_2_brut.png" },
	{ name: "Image 3", back: "assets/images_components_superpo/image_3_ir.png", front: "assets/images_components_superpo/image_3_brut.png" },
	{ name: "Image 4", back: "assets/images_components_superpo/image_4_ir.png", front: "assets/images_components_superpo/image_4_brut.png" },
];

const scene = document.querySelector("#scene");

if (scene) {
	// create crosshair element
	const crosshair = document.createElement("div");
	crosshair.className = "crosshair";
	scene.appendChild(crosshair);
	crosshair.style.opacity = "0";

	const style = scene.style;
	const backLayer = scene.querySelector(".layer-back");
	const trailLayer = scene.querySelector(".layer-trail");
	const frontLayer = scene.querySelector(".layer-front");
	const slider = scene.querySelector("#pair-slider");
	let currentPairIndex = 0;

	const applyPair = (index) => {
		const pair = imagePairs[index] ?? imagePairs[0];

		if (backLayer) {
			backLayer.style.backgroundImage = `url("${pair.back}")`;
		}

		if (trailLayer) {
			trailLayer.style.backgroundImage = `url("${pair.back}")`;
		}

		if (frontLayer) {
			frontLayer.style.backgroundImage = `url("${pair.front}")`;
		}
	};

	applyPair(currentPairIndex);

	if (slider) {
		slider.max = String(imagePairs.length - 1);
		slider.value = String(currentPairIndex);
		slider.addEventListener("input", () => {
			currentPairIndex = Number(slider.value);
			applyPair(currentPairIndex);
		});
	}

	let pointerX = 50;
	let pointerY = 50;
	let active = false;

	let mainX = 50;
	let mainY = 50;
	let mainVX = 0;
	let mainVY = 0;

	let trailX = 50;
	let trailY = 50;
	let trailVX = 0;
	let trailVY = 0;

	const updatePointer = (event) => {
		const rect = scene.getBoundingClientRect();
		pointerX = ((event.clientX - rect.left) / rect.width) * 100;
		pointerY = ((event.clientY - rect.top) / rect.height) * 100;

		// position crosshair in pixels relative to scene
		const px = event.clientX - rect.left;
		const py = event.clientY - rect.top;
		crosshair.style.left = `${px}px`;
		crosshair.style.top = `${py}px`;
		crosshair.style.opacity = "1";

		active = true;
	};

	scene.addEventListener("pointerenter", (event) => {
		updatePointer(event);
		scene.classList.add("is-active");
	});

	scene.addEventListener("pointermove", updatePointer);

	scene.addEventListener("pointerleave", () => {
		active = false;
		scene.classList.remove("is-active");
		// hide crosshair smoothly
		crosshair.style.opacity = "0";
	});

	const tick = () => {
		if (active) {
			mainVX += (pointerX - mainX) * 0.14;
			mainVY += (pointerY - mainY) * 0.14;
			mainVX *= 0.72;
			mainVY *= 0.72;
			mainX += mainVX;
			mainY += mainVY;

			trailVX += (mainX - trailX) * 0.08;
			trailVY += (mainY - trailY) * 0.08;
			trailVX *= 0.76;
			trailVY *= 0.76;
			trailX += trailVX;
			trailY += trailVY;
		} else {
			mainVX += (50 - mainX) * 0.04;
			mainVY += (50 - mainY) * 0.04;
			mainVX *= 0.82;
			mainVY *= 0.82;
			mainX += mainVX;
			mainY += mainVY;

			trailVX += (mainX - trailX) * 0.03;
			trailVY += (mainY - trailY) * 0.03;
			trailVX *= 0.84;
			trailVY *= 0.84;
			trailX += trailVX;
			trailY += trailVY;
		}

		style.setProperty("--mask-x", `${mainX}%`);
		style.setProperty("--mask-y", `${mainY}%`);
		style.setProperty("--trail-x", `${trailX}%`);
		style.setProperty("--trail-y", `${trailY}%`);

		requestAnimationFrame(tick);
	};

	requestAnimationFrame(tick);
}
