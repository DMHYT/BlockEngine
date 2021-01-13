/**
 * Class to work with world based on BlockSource
 */
class WorldRegion {
	blockSource: BlockSource;

	constructor(blockSource: BlockSource) {
		this.blockSource = blockSource;
	}

	/**
	 * @returns interface to given dimension 
	 * (null if given dimension is not loaded and this interface 
	 * was not created yet)
	 */
	static getForDimension(dimension: number): WorldRegion {
		let blockSource = BlockSource.getDefaultForDimension(dimension);
		if (blockSource) {
			return new WorldRegion(blockSource);
		}
		return null;
	}

	/**
	 * @returns interface to the dimension where the given entity is 
	 * (null if given entity does not exist or the dimension is not loaded 
	 * and interface was not created)
	 */
	static getForActor(entityUid: number): WorldRegion {
		let blockSource = BlockSource.getDefaultForActor(entityUid);
		if (blockSource) {
			return new WorldRegion(blockSource);
		}
		return null;
	}

	/**
	 * @returns the dimension id to which the following object belongs
	 */
	getDimension(): number {
		return this.blockSource.getDimension();
	}

	/**
	 * @returns Tile object with id and data propeties of the block at coords
	 */
	getBlock(coords: Vector): Tile;
	getBlock(x: number, y: number, z: number): Tile;
	getBlock(x: any, y?: number, z?: number): Tile {
		if (typeof x === "number") {
			return this.blockSource.getBlock(x, y, z);
		}
		let pos = x;
		return this.getBlock(pos.x, pos.y, pos.z);
	}

	/**
	 * @returns block's id at coords
	 */
	getBlockId(coords: Vector): number;
	getBlockId(x: number, y: number, z: number): number;
	getBlockId(x: any, y?: number, z?: number): number {
		return this.getBlock(x, y, z).id;
	}

	/**
	 * @returns block's data at coords
	 */
	getBlockData(coords: Vector): number;
	getBlockData(x: number, y: number, z: number): number;
	getBlockData(x: any, y?: number, z?: number): number {
		return this.getBlock(x, y, z).data;
	}

	/**
	 * Sets block on coords
	 * @param id - id of the block to set
	 * @param data - data of the block to set
	 */
	setBlock(coords: Vector, id: number, data: number): number;
	setBlock(x: number, y: number, z: number, id: number, data: number): number;
	setBlock(x: any, y: number, z: number, id?: number, data?: number): number {
		if (typeof x === "number") {
			return this.blockSource.setBlock(x, y, z, id, data);
		}
		let pos = x; id = y; data = z;
		return this.setBlock(pos.x, pos.y, pos.z, id, data);
	}

	/**
	 * Destroys block on coords producing appropriate drop and particles.
	 * @param drop whether to provide drop for the block or not
	 * @param player player entity if the block was destroyed by player
	 */
	destroyBlock(coords: Vector, drop?: boolean, player?: number): void;
	destroyBlock(x: number, y: number, z: number, drop?: boolean, player?: number): void;
	destroyBlock(x: any, y: any, z: any, drop?: any, player?: any): void {
		if (typeof x === "object") {
			let pos = x, drop = y, player = z;
			this.destroyBlock(pos.x, pos.y, pos.z, drop, player);
			return;
		}

		if (drop) {
			let block = this.getBlock(x, y, z);
			let item = player ? Entity.getCarriedItem(player) : new ItemStack();
			let result = Block.getBlockDropViaItem(block, item, new Vector3(x, y, z), this.blockSource);
			if (result) {
				for (let dropItem of result) {
					this.dropItem(x + .5, y + .5, z + .5, dropItem[0], dropItem[1], dropItem[2], dropItem[3] || null);
				}
			}
			this.blockSource.destroyBlock(x, y, z, !result);
		} else {
			this.blockSource.destroyBlock(x, y, z, false);
		}
	}

	/**
	 * @returns interface to the vanilla TileEntity (chest, furnace, etc.) on the coords
	 */
	getNativeTileEntity(coords: Vector): NativeTileEntity;
	getNativeTileEntity(x: number, y: number, z: number): NativeTileEntity;
	getNativeTileEntity(x: Vector | number, y?: number, z?: number): NativeTileEntity {
		if (typeof x === "number") {
			return this.blockSource.getBlockEntity(x, y, z);
		}
		let pos = x;
		return this.getNativeTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * @returns TileEntity located on the specified coordinates if it is initialized
     */
	getTileEntity(coords: Vector): TileEntity;
	getTileEntity(x: number, y: number, z: number): TileEntity;
	getTileEntity(x: Vector | number, y?: number, z?: number): TileEntity {
		if (typeof x === "number") {
			let tileEntity = TileEntity.getTileEntity(x, y, z, this.blockSource);
			if (tileEntity && tileEntity.__initialized) return tileEntity;
			return null;
		}
		let pos = x;
		return this.getTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * If the block on the specified coordinates is a TileEntity block and is 
     * not initialized, initializes it and returns created TileEntity object
     * @returns TileEntity if one was created, null otherwise
     */
	addTileEntity(coords: Vector): TileEntity;
	addTileEntity(x: number, y: number, z: number): TileEntity;
	addTileEntity(x: Vector | number, y?: number, z?: number): TileEntity {
		if (typeof x === "number") {
			return TileEntity.addTileEntity(x, y, z, this.blockSource);
		}
		let pos = x;
		return this.addTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * If the block on the specified coordinates is a TileEntity, destroys 
     * it, dropping its container
     * @returns true if the TileEntity was destroyed successfully, false 
     * otherwise
     */
	removeTileEntity(coords: Vector): boolean;
	removeTileEntity(x: number, y: number, z: number): boolean;
	removeTileEntity(x: Vector | number, y?: number, z?: number): boolean {
		if (typeof x === "number") {
			return TileEntity.destroyTileEntityAtCoords(x, y, z, this.blockSource);
		}
		let pos = x;
		return this.removeTileEntity(pos.x, pos.y, pos.z);
	}

	/**
     * @returns if the block on the specified coordinates is a TileEntity, returns
     * its container, if the block is a NativeTileEntity, returns it, if 
     * none of above, returns null
     */
	getContainer(coords: Vector): NativeTileEntity | UI.Container | ItemContainer;
	getContainer(x: number, y: number, z: number): NativeTileEntity | UI.Container | ItemContainer;
	getContainer(x: Vector | number, y?: number, z?: number): NativeTileEntity | UI.Container | ItemContainer {
		if (typeof x === "number") {
			return World.getContainer(x, y, z, this.blockSource);
		}
		let pos = x;
		return this.getContainer(pos.x, pos.y, pos.z);
	}

	/**
	 * Causes an explosion on coords
	 * @param power defines radius of the explosion and what blocks it can destroy
	 * @param fire if true, puts the crater on fire
	 */
	explode(x: number, y: number, z: number, power: number, fire: boolean = false): void {
		this.blockSource.explode(x, y, z, power, fire)
	}

	/**
	 * @returns biome id at X and Z coord
	 */
	getBiome(x: number, z: number): number {
		return this.blockSource.getBiome(x, z);
	}

	/**
	 * Sets biome id by coords
	 * @param id - id of the biome to set
	 */
	setBiome(x: number, z: number, biomeID: number): void {
		this.blockSource.setBiome(x, z, biomeID);
	}

	/**
	 * @returns temperature of the biome on coords
	 */
	getBiomeTemperatureAt(x: number, y: number, z: number): number {
		return this.blockSource.getBiomeTemperatureAt(x, y, z);
	}

	/**
	 * @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns true if chunk is loaded, false otherwise
	 */
	isChunkLoaded(chunkX: number, chunkZ: number): boolean {
		return this.blockSource.isChunkLoaded(chunkX, chunkZ);
	}

	/**
	 * @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns true if chunk on the position is loaded, false otherwise
	 */
	isChunkLoadedAt(x: number, z: number): boolean {
		return this.blockSource.isChunkLoadedAt(x, z);
	}

	/**
	 * @param chunkX X coord of the chunk
	 * @param chunkZ Z coord of the chunk
	 * @returns the loading state of the chunk by chunk coords
	 */
	getChunkState(chunkX: number, chunkZ: number): number {
		return this.blockSource.getChunkState(chunkX, chunkZ);
	}

	/**
	 * @param x X coord of the position
	 * @param z Z coord of the position
	 * @returns the loading state of the chunk by coords
	 */
	getChunkStateAt(x: number, z: number): number {
		return this.blockSource.getChunkStateAt(x, z);
	}

	/**
     * @returns light level on the specified coordinates, from 0 to 15
     */
	getLightLevel(coords: Vector): number;
	getLightLevel(x: number, y: number, z: number): number;
	getLightLevel(x: Vector | number, y?: number, z?: number): number {
		if (typeof x === "number") {
			return this.blockSource.getLightLevel(x, y, z);
		}
		let pos = x;
		return this.getLightLevel(pos.x, pos.y, pos.z);
	}

	/**
	 * @returns whether the sky can be seen from coords
	 */
	canSeeSky(coords: Vector): boolean;
	canSeeSky(x: number, y: number, z: number): boolean;
	canSeeSky(x: Vector | number, y?: number, z?: number): boolean {
		if (typeof x === "number") {
			return this.blockSource.canSeeSky(x, y, z);
		}
		let pos = x;
		return this.canSeeSky(pos.x, pos.y, pos.z);
	}

	/**
	 * @returns grass color on coords
	 */
	getGrassColor(coords: Vector): number;
	getGrassColor(x: number, y: number, z: number): number;
	getGrassColor(x: Vector | number, y?: number, z?: number): number {
		if (typeof x === "number") {
			return this.blockSource.getGrassColor(x, y, z);
		}
		let pos = x;
		return this.getGrassColor(pos.x, pos.y, pos.z);
	}

	/**
	 * Creates dropped item and returns entity id
	 * @param x X coord of the place where item will be dropped
	 * @param y Y coord of the place where item will be dropped
	 * @param z Z coord of the place where item will be dropped
	 * @param id id of the item to drop
	 * @param count count of the item to drop
	 * @param data data of the item to drop
	 * @param extra extra of the item to drop
	 * @returns drop entity id
	 */
	dropItem(x: number, y: number, z: number, id: number, count: number, data: number, extra: ItemExtraData = null): number {
		return this.blockSource.spawnDroppedItem(x, y, z, id, count, data, extra);
	}

	/**
	 * Spawns entity of given numeric type on coords
	 */
	spawnEntity(x: number, y: number, z: number, type: number | string): number;
	spawnEntity(x: number, y: number, z: number, namespace: string, type: string, init_data: string): number;
	spawnEntity(x: number, y: number, z: number, namespace: string, type?: string, init_data?: string): number {
		if (type === void 0) {
			return this.blockSource.spawnEntity(x, y, z, namespace);
		}
		return this.blockSource.spawnEntity(x, y, z, namespace, type, init_data);
	}

	/**
	 * Spawns experience orbs on coords
	 * @param amount experience amount
	 */
	spawnExpOrbs(x: number, y: number, z: number, amount: number): void {
		return this.blockSource.spawnExpOrbs(x, y, z, amount);
	}

	/**
	 * @returns the list of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is false,
	 * and all except the entities of the given type, if blacklist value is true
	 */
	fetchEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: number, blacklist: boolean = false): number[] {
		return this.blockSource.fetchEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
	}

	/**
	 * @returns the list of entity IDs in given box,
	 * that are equal to the given type, if blacklist value is false,
	 * and all except the entities of the given type, if blacklist value is true
	 */
	listEntitiesInAABB(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, type: number, blacklist: boolean = false): number[] {
		return this.blockSource.listEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
	}

	playSound(x: number, y: number, z: number, name: string, volume: number = 1, pitch: number = 1) {
		Network.sendToAllClients("WorldRegion.play_sound", {x: x, y: y, z: z, dimension: this.getDimension(), name: name, volume: volume, pitch: pitch});
	}
}

Network.addClientPacket("WorldRegion.play_sound", function(data: {x: number, y: number, z: number, dimension: number, name: string, volume: number, pitch: number}) {
	if (data.dimension == Player.getDimension()) {
		World.playSound(data.x, data.y, data.z, data.name, data.volume, data.pitch);
	}
});