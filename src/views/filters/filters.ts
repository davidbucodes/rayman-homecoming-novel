import * as PIXI from "pixi.js";
import { AlphaFilter } from "@pixi/filter-alpha";
import {
	DotFilter,
	GodrayFilter,
	OldFilmFilter,
	PixelateFilter,
	ShockwaveFilter,
} from "pixi-filters";
import { getBlendFilter } from "@pixi/picture";
import { Animation, AnimationCallback } from "../animation/animation";
import { FilterId } from "../../databases/identifiers/filterId";
import { ColorMatrixFilter } from "@pixi/filter-color-matrix";
import { Coordinates } from "../graphicElement/dimensions";

interface FilterReturnValue<T> {
	filter: T;
	animation?: Animation;
}

interface FilterOptions<T = FilterId> {
	filterId: T;
}
interface AlphaFilterOptions extends FilterOptions {
	filterId: FilterId.Alpha;
	alpha: number;
}
interface BlurFilterOptions extends FilterOptions {
	filterId: FilterId.Blur;
	strength?: number;
	quality?: number;
	resolution?: number;
}
interface PixelateFilterOptions extends FilterOptions {
	filterId: FilterId.Pixelate;
	size?: number;
}
interface ShockwaveFilterOptions extends FilterOptions {
	filterId: FilterId.Shockwave;
	amplitude?: number;
	waveLength?: number;
	brightness?: number;
	radius?: number;
	center: Coordinates;
}

interface RayFilterOptions extends FilterOptions {
	filterId: FilterId.Ray;
}

interface DarkenFilterOptions extends FilterOptions {
	filterId: FilterId.Darken;
}

export class Filters {
	static generate(options: AlphaFilterOptions): FilterReturnValue<AlphaFilter>;
	static generate(
		options: FilterOptions<FilterId.BlackAndWhite>,
	): FilterReturnValue<ColorMatrixFilter>;
	static generate(options: FilterOptions<FilterId.Blend>): FilterReturnValue<PIXI.Filter>;
	static generate(options: BlurFilterOptions): FilterReturnValue<PIXI.Filter>;
	static generate(options: FilterOptions<FilterId.Dots>): FilterReturnValue<PIXI.Filter>;
	static generate(options: FilterOptions<FilterId.Nostalgic>): FilterReturnValue<PIXI.Filter>;
	static generate(options: PixelateFilterOptions): FilterReturnValue<PIXI.Filter>;
	static generate(options: ShockwaveFilterOptions): FilterReturnValue<PIXI.Filter>;
	static generate(options: RayFilterOptions): FilterReturnValue<PIXI.Filter>;
	static generate(options: DarkenFilterOptions): FilterReturnValue<PIXI.Filter>;
	static generate(options: FilterOptions): FilterReturnValue<PIXI.Filter>;
	static generate(options: FilterOptions): FilterReturnValue<unknown> {
		switch (options.filterId) {
			case FilterId.Alpha:
				return this.generateAlphaFilter(options as unknown as AlphaFilterOptions);
			case FilterId.BlackAndWhite:
				return this.generateBlackAndWhiteFilter();
			case FilterId.Blend:
				return this.generateBlendFilter();
			case FilterId.Blur:
				return this.generateBlurFilter(options as unknown as BlurFilterOptions);
			case FilterId.Dots:
				return this.generateDotsFilter();
			case FilterId.Nostalgic:
				return this.generateNostalgicFilter();
			case FilterId.Pixelate:
				return this.generatePixelateFilter(options as unknown as PixelateFilterOptions);
			case FilterId.Shockwave:
				return this.generateShockwaveFilter(options as unknown as ShockwaveFilterOptions);
			case FilterId.Ray:
				return this.generateRayFilter();
			case FilterId.Darken:
				return this.generateDarkenFilter();
		}
	}

	private static generateBlackAndWhiteFilter() {
		const blackAndWhiteFilter = new PIXI.filters.ColorMatrixFilter();
		blackAndWhiteFilter.blackAndWhite(false);
		return { filter: blackAndWhiteFilter };
	}

	private static generateDotsFilter() {
		const dotFilter = new DotFilter(0.7, 1.5);
		return { filter: dotFilter };
	}

	private static generateBlendFilter() {
		const blendFilter = getBlendFilter(PIXI.BLEND_MODES.HARD_LIGHT);
		return { filter: blendFilter };
	}

	private static generateAlphaFilter(options: AlphaFilterOptions) {
		const alphaFilter = new PIXI.filters.AlphaFilter(options.alpha);
		return { filter: alphaFilter };
	}

	private static generateDarkenFilter() {
		const darkenFilter = new PIXI.filters.AlphaFilter(0.85);
		return { filter: darkenFilter };
	}

	private static generateNostalgicFilter() {
		const nostalgicFilter = new OldFilmFilter({
			sepia: 0.25,
			noise: 0.2,
			noiseSize: 1,
			scratch: -0.6,
			scratchDensity: 0.25,
			scratchWidth: 0,
			vignetting: 0.4,
			vignettingAlpha: 1,
			vignettingBlur: 0.2,
		});

		let currAnimationRound = 0;
		const roundToAnimate = 4;
		const animationCallback: AnimationCallback = () => {
			currAnimationRound++;
			if (currAnimationRound === roundToAnimate) {
				currAnimationRound = 0;
				nostalgicFilter.seed = Math.random();
			}
		};

		return {
			animation: new Animation({ callback: animationCallback }),
			filter: nostalgicFilter,
		};
	}

	private static generatePixelateFilter({ size = 4 }: PixelateFilterOptions) {
		const pixelateFilter = new PixelateFilter(size);
		return { filter: pixelateFilter };
	}

	private static generateBlurFilter({
		strength = 1.5,
		quality = 1,
		resolution = 2,
	}: BlurFilterOptions) {
		const blurFilter = new PIXI.filters.BlurFilter(strength, quality, resolution, 11);
		return { filter: blurFilter };
	}

	private static generateShockwaveFilter({
		amplitude = 25,
		waveLength = 170,
		brightness = 1,
		radius = 0,
		center = { x: 0, y: 0 },
	}: ShockwaveFilterOptions) {
		let time = 0;

		const centerPoint = new PIXI.Point(center.x, center.y);
		const shockwaveFilter = new ShockwaveFilter(
			centerPoint,
			{ amplitude, wavelength: waveLength, brightness, radius },
			time,
		);

		const animationCallback: AnimationCallback = () => {
			if (time > 2) {
				time = 0;
			}
			time += 0.025;
			shockwaveFilter.time = time;
		};
		return {
			animation: new Animation({ callback: animationCallback }),
			filter: shockwaveFilter,
		};
	}

	private static generateRayFilter() {
		let time = 0;

		const rayFilter = new GodrayFilter({
			gain: 0.5,
			lacunarity: 2.5,
			alpha: 1,
			angle: 30,
			time,
		});

		const animationCallback: AnimationCallback = () => {
			time += 0.005;
			rayFilter.time = time;
		};

		return {
			animation: new Animation({ callback: animationCallback }),
			filter: rayFilter,
		};
	}
}
