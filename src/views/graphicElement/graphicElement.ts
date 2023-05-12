import * as PIXI from "pixi.js";
import { cursorDatabase } from "../../databases/cursor";
import { CursorId } from "../../databases/identifiers/cursorId";
import { FilterId } from "../../databases/identifiers/filterId";
import { Timeout } from "../../device/timeout";
import { Animation } from "../animation/animation";
import { Dimensions } from "./dimensions";
import { Filters } from "../filters/filters";

export type GraphicElementOptions = {
	parentContainer: PIXI.Container;
	dimensions?: Dimensions;
	cursorId?: CursorId;
};

export abstract class GraphicElement<T extends GraphicElementOptions> {
	protected _container: PIXI.Container = null;
	protected _filterAnimation: Animation;

	constructor(protected options: T) {
		this._container = new PIXI.Container();

		this._container.x = this.options.dimensions?.x || 0;
		this._container.y = this.options.dimensions?.y || 0;
		this._container.width = this.options.dimensions?.width || 0;
		this._container.height = this.options.dimensions?.height || 0;

		this._container.cursor = `url('${
			cursorDatabase[this.options.cursorId || CursorId.Nonclickable].imageUrl
		}'),auto`;
		this._container.interactive = true;

		this.options.parentContainer?.addChild(this._container);
	}

	protected abstract init(): void;

	remove(): void {
		this._filterAnimation?.stop();
		this.options.parentContainer.removeChild(this._container);
		this._container.destroy();
	}

	setFilter(filter: PIXI.Filter, filterAnimation: Animation, startAnimation?: boolean) {
		this._container.filters = [];
		if (filter) {
			this._container.filters.push(filter);
			if (filterAnimation) {
				this._filterAnimation = filterAnimation;
				if (startAnimation) {
					this._filterAnimation.play();
				}
			} else {
				if (this._filterAnimation) {
					this._filterAnimation.play();
				}
			}
		}
	}

	protected async fadeOut({
		timeoutBefore,
		timeoutAfter,
	}: {
		timeoutBefore?: number;
		timeoutAfter?: number;
	}) {
		if (timeoutBefore) {
			await new Promise<void>((res) => {
				new Timeout(() => {
					return res();
				}, timeoutBefore);
			});
		}

		const startAlphaValue = 1;
		const { filter } = Filters.generate({ filterId: FilterId.Alpha, alpha: 1 });

		this._container.filters ||= [];
		this._container.filters.push(filter);

		const animationMilliseconds = 500;
		const fadeSteps = 10;

		for (let i = 1; i <= fadeSteps; i++) {
			filter.alpha = startAlphaValue - (startAlphaValue / fadeSteps) * i;
			await new Promise<void>((res) => {
				new Timeout(() => {
					return res();
				}, animationMilliseconds / fadeSteps);
			});
		}

		if (timeoutAfter) {
			await new Promise<void>((res) => {
				new Timeout(() => {
					return res();
				}, timeoutAfter);
			});
		}
	}
}
