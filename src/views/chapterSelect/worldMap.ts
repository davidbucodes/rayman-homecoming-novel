import * as PIXI from "pixi.js";
import { CharacterId } from "../../databases/identifiers/characterId";
import {
	MapDirection,
	oppositeMapDirectionDictionary,
	worldMapDatabase,
	WorldMapPoint,
} from "../../databases/worldMap";
import { Timeout } from "../../device/timeout";
import { MouseEvents } from "../../events/mouseEvents";
import { RelativeCoordinates, Size } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { TexturesLoader } from "../loaders/texturesLoader";
import { CharacterBadge } from "./characterBadge";

interface WorldMapOptions extends GraphicElementOptions {
	onPointSelected(
		selectedPoint: WorldMapPoint,
		nextPointsDirections: Record<MapDirection, CharacterId>,
	): void;
	onPointDoubleClicked(selectedPoint: WorldMapPoint): void;
	badgeSize?: Size;
}

const defaultOptions: Partial<WorldMapOptions> = {
	badgeSize: {
		height: 110,
		width: 110,
	},
};

export class WorldMap extends GraphicElement<WorldMapOptions> {
	private _currCharacterId: CharacterId;
	private _nextPointsByDirections: Record<MapDirection, CharacterId>;
	private _characterToBadge: Partial<Record<CharacterId, CharacterBadge>>;

	constructor(options: WorldMapOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		this._characterToBadge = {};
	}

	get selectedPoint(): WorldMapPoint {
		return worldMapDatabase.points[this._currCharacterId];
	}

	moveTo(mapDirection: MapDirection) {
		const nextBadge = this._nextPointsByDirections[mapDirection];
		if (nextBadge) {
			this.setCurrBadge(worldMapDatabase.points[nextBadge].characterId);
		}
	}

	async draw() {
		const worldMapStartPoint = worldMapDatabase.startPoint;

		await this.drawPointsRecursively(worldMapStartPoint, this.options.badgeSize);

		this.setCurrBadge(worldMapStartPoint.characterId);
	}

	private setCurrBadge(characterId: CharacterId) {
		if (this._currCharacterId) {
			this._characterToBadge[this._currCharacterId]?.setSelected(false);
		}
		this._currCharacterId = characterId;
		this._characterToBadge[characterId]?.setSelected(true);

		const badgeLinks = worldMapDatabase.links.filter((link) =>
			[link[0], link[1]].includes(characterId),
		);

		this._nextPointsByDirections = badgeLinks.reduce((reducer, [from, to, direction]) => {
			if (from === characterId) {
				reducer[direction] = to;
			}
			if (to === characterId) {
				reducer[oppositeMapDirectionDictionary[direction]] = from;
			}
			return reducer;
		}, {} as Record<MapDirection, CharacterId>);

		const point = worldMapDatabase.points[characterId];
		this.options.onPointSelected(point, this._nextPointsByDirections);
	}

	private async drawPointsRecursively(currentMapPoint: WorldMapPoint, badgeSize: Size) {
		if (this._characterToBadge[currentMapPoint.characterId]) {
			return;
		}

		const { x, y } = this.relativeCoordinateToCoordinate(
			currentMapPoint.mapRelativeCoordinates,
		);

		this._characterToBadge[currentMapPoint.characterId] = new CharacterBadge({
			parentContainer: this._container,
			dimensions: {
				x: x - badgeSize.width / 2,
				y: y - badgeSize.height / 2,
				...badgeSize,
			},
			characterId: currentMapPoint.characterId,
			setCurrentClickedBadge: (characterId) => {
				if (this._currCharacterId !== characterId) {
					this.setCurrBadge(characterId);
				} else {
					MouseEvents.removeAllEvents();
					this.options.onPointDoubleClicked(worldMapDatabase.points[characterId]);
				}
			},
		});

		if (this._currCharacterId === currentMapPoint.characterId) {
			this._characterToBadge[currentMapPoint.characterId].setSelected(true);
		}

		const nextBadges = worldMapDatabase.links
			.filter((link) => link[0] === currentMapPoint.characterId)
			.map(([, nextId]) => worldMapDatabase.points[nextId]);

		await Promise.all(
			nextBadges.map(async (badge) => {
				const { x: nextX, y: nextY } = this.relativeCoordinateToCoordinate(
					badge.mapRelativeCoordinates,
				);
				await this.drawLine(20, x, y, nextX, nextY);

				this.drawPointsRecursively(badge, badgeSize);
			}),
		);
	}

	private async drawLine(pointSize: number, x: number, y: number, nextX: number, nextY: number) {
		const pointsAreaLength = Math.hypot(nextX - x, nextY - y);
		const pointPaddingLeftRight = pointSize / 2;
		const pointLength = pointPaddingLeftRight * 2 + pointSize;
		const pointCount = Math.ceil(pointsAreaLength / pointLength);

		await TexturesLoader.load(["./assets/images/map/mark.png"]);
		const pointTexture = TexturesLoader.get("./assets/images/map/mark.png");

		for (let pointIndex = 0; pointIndex < pointCount; pointIndex++) {
			if (pointIndex <= 1 || pointIndex >= pointCount - 1) {
				continue;
			}

			const currPoint = new PIXI.Sprite();

			currPoint.width = pointSize;
			currPoint.height = pointSize;
			currPoint.x = x + (Math.ceil(nextX - x) / pointCount) * pointIndex;
			currPoint.y = y + (Math.ceil(nextY - y) / pointCount) * pointIndex;
			currPoint.texture = pointTexture;
			currPoint.anchor.set(0.5);

			this._container.addChild(currPoint);
			await new Promise((resolve) => new Timeout(resolve, 30));
		}
	}

	private relativeCoordinateToCoordinate(mapRelativeCoordinates: RelativeCoordinates) {
		const x = this.options.dimensions.width * mapRelativeCoordinates.relativeX;
		const y = this.options.dimensions.height * mapRelativeCoordinates.relativeY;
		return { x, y };
	}
}
