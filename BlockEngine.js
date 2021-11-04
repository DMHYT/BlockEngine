var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
LIBRARY({
    name: "BlockEngine",
    version: 7,
    shared: true,
    api: "CoreEngine"
});
var EntityGetYaw = ModAPI.requireGlobal("Entity.getYaw");
var EntityGetPitch = ModAPI.requireGlobal("Entity.getPitch");
var BlockEngine;
(function (BlockEngine) {
    var gameVersion = getMCPEVersion().array;
    function getGameVersion() {
        return gameVersion;
    }
    BlockEngine.getGameVersion = getGameVersion;
    function getMainGameVersion() {
        return gameVersion[1];
    }
    BlockEngine.getMainGameVersion = getMainGameVersion;
    function sendUnlocalizedMessage(client) {
        var texts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            texts[_i - 1] = arguments[_i];
        }
        client.send("blockengine.clientMessage", { texts: texts });
    }
    BlockEngine.sendUnlocalizedMessage = sendUnlocalizedMessage;
})(BlockEngine || (BlockEngine = {}));
Network.addClientPacket("blockengine.clientMessage", function (data) {
    var message = data.texts.map(Translation.translate).join("");
    Game.message(message);
});
var BlockEngine;
(function (BlockEngine) {
    var Decorators;
    (function (Decorators) {
        function createField(target, field) {
            target[field] = __assign({}, target[field]);
        }
        function ClientSide(target, propertyName) {
            createField(target, "client");
            target.client[propertyName] = target[propertyName];
        }
        Decorators.ClientSide = ClientSide;
        function NetworkEvent(side) {
            return function (target, propertyName) {
                if (side == Side.Client) {
                    createField(target, "client");
                    createField(target.client, "events");
                    target.client.events[propertyName] = target[propertyName];
                    delete target[propertyName];
                }
                else {
                    createField(target, "events");
                    target.events[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.NetworkEvent = NetworkEvent;
        function ContainerEvent(side) {
            return function (target, propertyName) {
                if (side == Side.Client) {
                    createField(target, "client");
                    createField(target.client, "containerEvents");
                    target.client.containerEvents[propertyName] = target[propertyName];
                    delete target[propertyName];
                }
                else {
                    createField(target, "containerEvents");
                    target.containerEvents[propertyName] = target[propertyName];
                }
            };
        }
        Decorators.ContainerEvent = ContainerEvent;
    })(Decorators = BlockEngine.Decorators || (BlockEngine.Decorators = {}));
})(BlockEngine || (BlockEngine = {}));
var Side;
(function (Side) {
    Side[Side["Client"] = 0] = "Client";
    Side[Side["Server"] = 1] = "Server";
})(Side || (Side = {}));
var ItemCategory;
(function (ItemCategory) {
    ItemCategory[ItemCategory["BUILDING"] = 1] = "BUILDING";
    ItemCategory[ItemCategory["NATURE"] = 2] = "NATURE";
    ItemCategory[ItemCategory["EQUIPMENT"] = 3] = "EQUIPMENT";
    ItemCategory[ItemCategory["ITEMS"] = 4] = "ITEMS";
})(ItemCategory || (ItemCategory = {}));
var EnumRarity;
(function (EnumRarity) {
    EnumRarity[EnumRarity["COMMON"] = 0] = "COMMON";
    EnumRarity[EnumRarity["UNCOMMON"] = 1] = "UNCOMMON";
    EnumRarity[EnumRarity["RARE"] = 2] = "RARE";
    EnumRarity[EnumRarity["EPIC"] = 3] = "EPIC";
})(EnumRarity || (EnumRarity = {}));
var MiningLevel;
(function (MiningLevel) {
    MiningLevel[MiningLevel["STONE"] = 1] = "STONE";
    MiningLevel[MiningLevel["IRON"] = 2] = "IRON";
    MiningLevel[MiningLevel["DIAMOND"] = 3] = "DIAMOND";
    MiningLevel[MiningLevel["OBSIDIAN"] = 4] = "OBSIDIAN";
})(MiningLevel || (MiningLevel = {}));
var Vector3 = /** @class */ (function () {
    function Vector3(vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x = vx;
            this.y = vy;
            this.z = vz;
        }
        else {
            var v = vx;
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
    }
    Vector3.getDirection = function (side) {
        switch (side) {
            case 0: return this.DOWN;
            case 1: return this.UP;
            case 2: return this.NORTH;
            case 3: return this.SOUTH;
            case 4: return this.EAST;
            case 5: return this.WEST;
            default: Logger.Log("Invalid block side: " + side, "ERROR");
        }
    };
    Vector3.prototype.copy = function (dst) {
        if (dst) {
            return dst.set(this);
        }
        return new Vector3(this);
    };
    Vector3.prototype.set = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x = vx;
            this.y = vy;
            this.z = vz;
            return this;
        }
        var v = vx;
        return this.set(v.x, v.y, v.z);
    };
    Vector3.prototype.add = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x += vx;
            this.y += vy;
            this.z += vz;
            return this;
        }
        var v = vx;
        return this.add(v.x, v.y, v.z);
    };
    Vector3.prototype.addScaled = function (v, scale) {
        return this.add(v.x * scale, v.y * scale, v.z * scale);
    };
    Vector3.prototype.sub = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            this.x -= vx;
            this.y -= vy;
            this.z -= vz;
            return this;
        }
        var v = vx;
        return this.sub(v.x, v.y, v.z);
    };
    Vector3.prototype.cross = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return this.set(this.y * vz - this.z * vy, this.z * vx - this.x * vz, this.x * vy - this.y * vx);
        }
        var v = vx;
        return this.cross(v.x, v.y, v.z);
    };
    Vector3.prototype.dot = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return this.x * vx + this.y * vy + this.z * vz;
        }
        var v = vx;
        return this.dot(v.x, v.y, v.z);
    };
    Vector3.prototype.normalize = function () {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    };
    Vector3.prototype.lengthSquared = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };
    Vector3.prototype.length = function () {
        return Math.sqrt(this.lengthSquared());
    };
    Vector3.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    Vector3.prototype.distanceSquared = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            var dx = vx - this.x;
            var dy = vy - this.y;
            var dz = vz - this.z;
            return dx * dx + dy * dy + dz * dz;
        }
        var v = vx;
        return this.distanceSquared(v.x, v.y, v.z);
    };
    Vector3.prototype.distance = function (vx, vy, vz) {
        if (typeof (vx) == "number") {
            return Math.sqrt(this.distanceSquared(vx, vy, vz));
        }
        var v = vx;
        return this.distance(v.x, v.y, v.z);
    };
    Vector3.prototype.scale = function (factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    };
    Vector3.prototype.scaleTo = function (len) {
        var factor = len / this.length();
        return this.scale(factor);
    };
    Vector3.prototype.toString = function () {
        return "[ " + this.x + ", " + this.y + ", " + this.z + " ]";
    };
    Vector3.DOWN = new Vector3(0, -1, 0);
    Vector3.UP = new Vector3(0, 1, 0);
    Vector3.NORTH = new Vector3(0, 0, -1);
    Vector3.SOUTH = new Vector3(0, 0, 1);
    Vector3.EAST = new Vector3(-1, 0, 0);
    Vector3.WEST = new Vector3(1, 0, 0);
    return Vector3;
}());
EXPORT("Vector3", Vector3);
/**
 * Class to work with world based on BlockSource
 */
var WorldRegion = /** @class */ (function () {
    function WorldRegion(blockSource) {
        this.blockSource = blockSource;
    }
    /**
     * @returns interface to given dimension
     * (null if given dimension is not loaded and this interface
     * was not created yet)
     */
    WorldRegion.getForDimension = function (dimension) {
        var blockSource = BlockSource.getDefaultForDimension(dimension);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    /**
     * @returns interface to the dimension where the given entity is
     * (null if given entity does not exist or the dimension is not loaded
     * and interface was not created)
     */
    WorldRegion.getForActor = function (entityUid) {
        var blockSource = BlockSource.getDefaultForActor(entityUid);
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    WorldRegion.getCurrentWorldGenRegion = function () {
        var blockSource = BlockSource.getCurrentWorldGenRegion();
        if (blockSource) {
            return new WorldRegion(blockSource);
        }
        return null;
    };
    /**
     * @returns the dimension id to which the following object belongs
     */
    WorldRegion.prototype.getDimension = function () {
        return this.blockSource.getDimension();
    };
    WorldRegion.prototype.getBlock = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBlock(x, y, z);
        }
        var pos = x;
        return this.blockSource.getBlock(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getBlockId = function (x, y, z) {
        return this.getBlock(x, y, z).id;
    };
    WorldRegion.prototype.getBlockData = function (x, y, z) {
        return this.getBlock(x, y, z).data;
    };
    WorldRegion.prototype.setBlock = function (x, y, z, id, data) {
        if (typeof x === "number") {
            if (typeof id == "number") {
                this.blockSource.setBlock(x, y, z, id, data);
            }
            else {
                this.blockSource.setBlock(x, y, z, id);
            }
        }
        else {
            var pos = x;
            id = y;
            data = z;
            if (typeof id == "number") {
                this.blockSource.setBlock(pos.x, pos.y, pos.z, id, data);
            }
            else {
                this.blockSource.setBlock(pos.x, pos.y, pos.z, id);
            }
        }
    };
    WorldRegion.prototype.setExtraBlock = function (x, y, z, id, data) {
        if (typeof x === "number") {
            if (typeof id == "number") {
                this.blockSource.setExtraBlock(x, y, z, id, data);
            }
            else {
                this.blockSource.setExtraBlock(x, y, z, id);
            }
        }
        else {
            var pos = x;
            id = y;
            data = z;
            if (typeof id == "number") {
                this.blockSource.setExtraBlock(pos.x, pos.y, pos.z, id, data);
            }
            else {
                this.blockSource.setExtraBlock(pos.x, pos.y, pos.z, id);
            }
        }
    };
    WorldRegion.prototype.getExtraBlock = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getExtraBlock(x, y, z);
        }
        var pos = x;
        return this.blockSource.getExtraBlock(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.destroyBlock = function (x, y, z, drop, player) {
        if (typeof x === "object") {
            var pos = x, drop_1 = y, player_1 = z;
            this.destroyBlock(pos.x, pos.y, pos.z, drop_1, player_1);
            return;
        }
        if (drop) {
            var block = this.getBlock(x, y, z);
            var item = player ? Entity.getCarriedItem(player) : new ItemStack();
            var result = Block.getBlockDropViaItem(block, item, new Vector3(x, y, z), this.blockSource);
            if (result) {
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var dropItem = result_1[_i];
                    this.dropItem(x + .5, y + .5, z + .5, dropItem[0], dropItem[1], dropItem[2], dropItem[3] || null);
                }
            }
            this.blockSource.destroyBlock(x, y, z, !result);
        }
        else {
            this.blockSource.destroyBlock(x, y, z, false);
        }
    };
    WorldRegion.prototype.breakBlock = function (x, y, z, allowDrop, entity, item) {
        if (typeof x === "number") {
            this.blockSource.breakBlock(x, y, z, allowDrop, entity, item);
        }
        else {
            var pos = x;
            item = allowDrop;
            entity = z;
            allowDrop = y;
            this.blockSource.breakBlock(pos.x, pos.y, pos.z, allowDrop, entity, item);
        }
    };
    WorldRegion.prototype.breakBlockForResult = function (x, y, z, player, item) {
        if (typeof x === "number") {
            return this.blockSource.breakBlockForJsResult(x, y, z, player, item);
        }
        var pos = x;
        player = y;
        item = z;
        return this.blockSource.breakBlockForJsResult(pos.x, pos.y, pos.z, player, item);
    };
    WorldRegion.prototype.getNativeTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBlockEntity(x, y, z);
        }
        var pos = x;
        return this.blockSource.getBlockEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            var tileEntity = TileEntity.getTileEntity(x, y, z, this.blockSource);
            return (tileEntity && tileEntity.__initialized) ? tileEntity : null;
        }
        var pos = x;
        return this.getTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.addTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return TileEntity.addTileEntity(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.addTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.removeTileEntity = function (x, y, z) {
        if (typeof x === "number") {
            return TileEntity.destroyTileEntityAtCoords(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.removeTileEntity(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getContainer = function (x, y, z) {
        if (typeof x === "number") {
            return World.getContainer(x, y, z, this.blockSource);
        }
        var pos = x;
        return this.getContainer(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.explode = function (x, y, z, power, fire) {
        if (typeof x === "number") {
            this.blockSource.explode(x, y, z, power, fire || false);
        }
        else {
            var pos = x;
            power = y;
            fire = z || false;
            this.blockSource.explode(pos.x, pos.y, pos.z, power, fire);
        }
    };
    /**
     * @returns biome id at X and Z coord
     */
    WorldRegion.prototype.getBiome = function (x, z) {
        return this.blockSource.getBiome(x, z);
    };
    /**
     * Sets biome id by coords
     * @param id - id of the biome to set
     */
    WorldRegion.prototype.setBiome = function (x, z, biomeID) {
        this.blockSource.setBiome(x, z, biomeID);
    };
    WorldRegion.prototype.getBiomeTemperatureAt = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getBiomeTemperatureAt(x, y, z);
        }
        var pos = x;
        return this.blockSource.getBiomeTemperatureAt(pos.x, pos.y, pos.z);
    };
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns true if chunk is loaded, false otherwise
     */
    WorldRegion.prototype.isChunkLoaded = function (chunkX, chunkZ) {
        return this.blockSource.isChunkLoaded(chunkX, chunkZ);
    };
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns true if chunk on the position is loaded, false otherwise
     */
    WorldRegion.prototype.isChunkLoadedAt = function (x, z) {
        return this.blockSource.isChunkLoadedAt(x, z);
    };
    /**
     * @param chunkX X coord of the chunk
     * @param chunkZ Z coord of the chunk
     * @returns the loading state of the chunk by chunk coords
     */
    WorldRegion.prototype.getChunkState = function (chunkX, chunkZ) {
        return this.blockSource.getChunkState(chunkX, chunkZ);
    };
    /**
     * @param x X coord of the position
     * @param z Z coord of the position
     * @returns the loading state of the chunk by coords
     */
    WorldRegion.prototype.getChunkStateAt = function (x, z) {
        return this.blockSource.getChunkStateAt(x, z);
    };
    WorldRegion.prototype.getLightLevel = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getLightLevel(x, y, z);
        }
        var pos = x;
        return this.blockSource.getLightLevel(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.canSeeSky = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.canSeeSky(x, y, z);
        }
        var pos = x;
        return this.blockSource.canSeeSky(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.getGrassColor = function (x, y, z) {
        if (typeof x === "number") {
            return this.blockSource.getGrassColor(x, y, z);
        }
        var pos = x;
        return this.blockSource.getGrassColor(pos.x, pos.y, pos.z);
    };
    WorldRegion.prototype.dropItem = function (x, y, z, item, count, data, extra) {
        if (typeof item == "object") {
            return this.blockSource.spawnDroppedItem(x, y, z, item.id, item.count, item.data, item.extra || null);
        }
        return this.blockSource.spawnDroppedItem(x, y, z, item, count, data, extra || null);
    };
    WorldRegion.prototype.spawnEntity = function (x, y, z, namespace, type, init_data) {
        if (type === void 0) {
            return this.blockSource.spawnEntity(x, y, z, namespace);
        }
        return this.blockSource.spawnEntity(x, y, z, namespace, type, init_data);
    };
    /**
     * Spawns experience orbs on coords
     * @param amount experience amount
     */
    WorldRegion.prototype.spawnExpOrbs = function (x, y, z, amount) {
        this.blockSource.spawnExpOrbs(x, y, z, amount);
    };
    WorldRegion.prototype.listEntitiesInAABB = function (x1, y1, z1, x2, y2, z2, type, blacklist) {
        if (type === void 0) { type = -1; }
        if (blacklist === void 0) { blacklist = true; }
        if (typeof x1 == "object") {
            var pos1 = x1, pos2 = y1;
            return this.listEntitiesInAABB(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z, z1, x2);
        }
        var entities = this.blockSource.listEntitiesInAABB(x1, y1, z1, x2, y2, z2, type, blacklist);
        if (BlockEngine.getMainGameVersion() == 11 && (type == Native.EntityType.PLAYER) != blacklist) {
            var players = Network.getConnectedPlayers();
            var dimension = this.getDimension();
            for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                var ent = players_1[_i];
                if (Entity.getDimension(ent) != dimension)
                    continue;
                var c = Entity.getPosition(ent);
                if ((c.x >= x1 && c.x <= x2) && (c.y - 1.62 >= y1 && c.y - 1.62 <= y2) && (c.z >= z1 && c.z <= z2)) {
                    entities.push(ent);
                }
            }
        }
        return entities;
    };
    /**
     * Plays standart Minecraft sound on the specified coordinates
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
    WorldRegion.prototype.playSound = function (x, y, z, name, volume, pitch) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        var soundPos = new Vector3(x, y, z);
        this.sendPacketInRadius(soundPos, 100, "WorldRegion.play_sound", __assign(__assign({}, soundPos), { name: name, volume: volume, pitch: pitch }));
    };
    /**
     * Plays standart Minecraft sound from the specified entity
     * @param name sound name
     * @param volume sound volume from 0 to 1. Default is 1.
     * @param pitch sound pitch, from 0 to 1. Default is 1.
     */
    WorldRegion.prototype.playSoundAtEntity = function (ent, name, volume, pitch) {
        if (volume === void 0) { volume = 1; }
        if (pitch === void 0) { pitch = 1; }
        var soundPos = Entity.getPosition(ent);
        this.sendPacketInRadius(soundPos, 100, "WorldRegion.play_sound_at", { ent: ent, name: name, volume: volume, pitch: pitch });
    };
    /**
     * Sends network packet for players in a radius from specified coords
     * @param packetName name of the packet to send
     * @param data packet data object
     */
    WorldRegion.prototype.sendPacketInRadius = function (coords, radius, packetName, data) {
        var dimension = this.getDimension();
        var clientsList = Network.getConnectedClients();
        for (var _i = 0, clientsList_1 = clientsList; _i < clientsList_1.length; _i++) {
            var client = clientsList_1[_i];
            var player = client.getPlayerUid();
            var entPos = Entity.getPosition(player);
            if (Entity.getDimension(player) == dimension && Entity.getDistanceBetweenCoords(entPos, coords) <= radius) {
                client.send(packetName, data);
            }
        }
    };
    return WorldRegion;
}());
Network.addClientPacket("WorldRegion.play_sound", function (data) {
    World.playSound(data.x, data.y, data.z, data.name, data.volume, data.pitch);
});
Network.addClientPacket("WorldRegion.play_sound_at", function (data) {
    World.playSoundAtEntity(data.ent, data.name, data.volume, data.pitch);
});
var PlayerEntity = /** @class */ (function () {
    function PlayerEntity(playerUid) {
        this.actor = new PlayerActor(playerUid);
        this.playerUid = playerUid;
    }
    /**
     * @returns player's unique numeric entity id
     */
    PlayerEntity.prototype.getUid = function () {
        return this.playerUid;
    };
    /**
     * @returns the id of dimension where player is.
     */
    PlayerEntity.prototype.getDimension = function () {
        return this.actor.getDimension();
    };
    /**
     * @returns player's gamemode.
     */
    PlayerEntity.prototype.getGameMode = function () {
        return this.actor.getGameMode();
    };
    PlayerEntity.prototype.addItemToInventory = function (id, count, data, extra) {
        var item = id;
        if (typeof item == "object") {
            this.actor.addItemToInventory(item.id, item.count, item.data, item.extra || null, true);
        }
        else {
            this.actor.addItemToInventory(id, count, data, extra || null, true);
        }
    };
    /**
     * @returns inventory slot's contents.
     */
    PlayerEntity.prototype.getInventorySlot = function (slot) {
        var item = this.actor.getInventorySlot(slot);
        return new ItemStack(item);
    };
    PlayerEntity.prototype.setInventorySlot = function (slot, item, count, data, extra) {
        if (extra === void 0) { extra = null; }
        if (typeof item == "object") {
            this.actor.setInventorySlot(slot, item.id, item.count, item.data, item.extra || null);
        }
        else {
            this.actor.setInventorySlot(slot, item, count, data, extra);
        }
    };
    /**
     * @returns item in player's hand
    */
    PlayerEntity.prototype.getCarriedItem = function () {
        var item = Entity.getCarriedItem(this.getUid());
        return new ItemStack(item);
    };
    PlayerEntity.prototype.setCarriedItem = function (item, count, data, extra) {
        if (extra === void 0) { extra = null; }
        if (typeof item == "object") {
            Entity.setCarriedItem(this.getUid(), item.id, item.count, item.data, item.extra);
        }
        else {
            Entity.setCarriedItem(this.getUid(), item, count, data, extra);
        }
    };
    /**
     * Decreases carried item count by specified number
     * @param amount amount of items to decrease, default is 1
     */
    PlayerEntity.prototype.decreaseCarriedItem = function (amount) {
        if (amount === void 0) { amount = 1; }
        var item = this.getCarriedItem();
        this.setCarriedItem(item.id, item.count - amount, item.data, item.extra);
    };
    /**
     * @returns armor slot's contents.
     */
    PlayerEntity.prototype.getArmor = function (slot) {
        var item = this.actor.getArmor(slot);
        return new ItemStack(item);
    };
    PlayerEntity.prototype.setArmor = function (slot, item, count, data, extra) {
        if (extra === void 0) { extra = null; }
        if (typeof item == "object") {
            this.actor.setArmor(slot, item.id, item.count, item.data, item.extra || null);
        }
        else {
            this.actor.setArmor(slot, item, count, data, extra);
        }
    };
    /**
     * Sets respawn coords for the player.
     */
    PlayerEntity.prototype.setRespawnCoords = function (x, y, z) {
        this.actor.setRespawnCoords(x, y, z);
    };
    /**
     * Spawns exp on coords.
     * @param value experience points value
     */
    PlayerEntity.prototype.spawnExpOrbs = function (x, y, z, value) {
        this.actor.spawnExpOrbs(x, y, z, value);
    };
    /**
     * @returns whether the player is a valid entity.
     */
    PlayerEntity.prototype.isValid = function () {
        return this.actor.isValid();
    };
    /**
     * @returns player's selected slot.
     */
    PlayerEntity.prototype.getSelectedSlot = function () {
        return this.actor.getSelectedSlot();
    };
    /**
     * Sets player's selected slot.
     */
    PlayerEntity.prototype.setSelectedSlot = function (slot) {
        this.actor.setSelectedSlot(slot);
    };
    /**
     * @returns player's experience.
     */
    PlayerEntity.prototype.getExperience = function () {
        return this.actor.getExperience();
    };
    /**
     * Sets player's experience.
     */
    PlayerEntity.prototype.setExperience = function (value) {
        this.actor.setExperience(value);
    };
    /**
     * Add experience to player.
     */
    PlayerEntity.prototype.addExperience = function (amount) {
        this.actor.addExperience(amount);
    };
    /**
     * @returns player's xp level.
     */
    PlayerEntity.prototype.getLevel = function () {
        return this.actor.getLevel();
    };
    /**
     * Sets player's xp level.
     */
    PlayerEntity.prototype.setLevel = function (level) {
        this.actor.setLevel(level);
    };
    /**
     * @returns player's exhaustion.
     */
    PlayerEntity.prototype.getExhaustion = function () {
        return this.actor.getExhaustion();
    };
    /**
     * Sets player's exhaustion.
     */
    PlayerEntity.prototype.setExhaustion = function (value) {
        this.actor.setExhaustion(value);
    };
    /**
     * @returns player's hunger.
     */
    PlayerEntity.prototype.getHunger = function () {
        return this.actor.getHunger();
    };
    /**
     * Sets player's hunger.
     */
    PlayerEntity.prototype.setHunger = function (value) {
        this.actor.setHunger(value);
    };
    /**
     * @returns player's saturation.
     */
    PlayerEntity.prototype.getSaturation = function () {
        return this.actor.getSaturation();
    };
    /**
     * Sets player's saturation.
     */
    PlayerEntity.prototype.setSaturation = function (value) {
        this.actor.setSaturation(value);
    };
    /**
     * @returns player's score.
     */
    PlayerEntity.prototype.getScore = function () {
        return this.actor.getScore();
    };
    /**
     * Sets player's score.
     */
    PlayerEntity.prototype.setScore = function (value) {
        this.actor.setScore(value);
    };
    return PlayerEntity;
}());
var EntityCustomData;
(function (EntityCustomData) {
    var entities = {};
    function getAll() {
        return entities;
    }
    EntityCustomData.getAll = getAll;
    function getData(entity) {
        var data = entities[entity];
        if (!data) {
            data = {};
            putData(entity, data);
        }
        return data;
    }
    EntityCustomData.getData = getData;
    function putData(entity, data) {
        entities[entity] = data;
    }
    EntityCustomData.putData = putData;
    function getField(entity, key) {
        var playerData = getData(entity);
        if (playerData) {
            return playerData[key];
        }
    }
    EntityCustomData.getField = getField;
    function putField(entity, key, value) {
        var data = getData(entity);
        data[key] = value;
    }
    EntityCustomData.putField = putField;
    Saver.addSavesScope("EntityData", function read(scope) {
        entities = scope || {};
    }, function save() {
        return entities;
    });
    Callback.addCallback("EntityRemoved", function (entity) {
        delete entities[entity];
    });
})(EntityCustomData || (EntityCustomData = {}));
var BlockModeler;
(function (BlockModeler) {
    function getRotatedBoxVertexes(box, rotation) {
        switch (rotation) {
            case 0:
                return box;
            case 1:
                return [1 - box[3], box[1], 1 - box[5], 1 - box[0], box[4], 1 - box[2]]; // rotate 180°
            case 2:
                return [box[2], box[1], 1 - box[3], box[5], box[4], 1 - box[0]]; // rotate 270°
            case 3:
                return [1 - box[5], box[1], box[0], 1 - box[2], box[4], box[3]]; // rotate 90°
        }
    }
    BlockModeler.getRotatedBoxVertexes = getRotatedBoxVertexes;
    function setStairsRenderModel(id) {
        var boxes = [
            [0, 0, 0, 1, 0.5, 1],
            [0.5, 0.5, 0.5, 1, 1, 1],
            [0, 0.5, 0.5, 0.5, 1, 1],
            [0.5, 0.5, 0, 1, 1, 0.5],
            [0, 0.5, 0, 0.5, 1, 0.5]
        ];
        createStairsRenderModel(id, 0, boxes);
        var newBoxes = [];
        for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
            var box = boxes_1[_i];
            newBoxes.push([box[0], 1 - box[4], box[2], box[3], 1 - box[1], box[5]]);
        }
        createStairsRenderModel(id, 4, newBoxes);
    }
    BlockModeler.setStairsRenderModel = setStairsRenderModel;
    function createStairsRenderModel(id, startData, boxes) {
        var modelConditionData = [
            { data: 3, posR: [-1, 0], posB: [0, 1] },
            { data: 2, posR: [1, 0], posB: [0, -1] },
            { data: 0, posR: [0, 1], posB: [1, 0] },
            { data: 1, posR: [0, -1], posB: [-1, 0] }
        ];
        for (var i = 0; i < 4; i++) {
            var conditionData = modelConditionData[i];
            var data = startData + i;
            var rBlockData = conditionData.data + startData;
            var groupR = ICRender.getGroup("stairs:" + rBlockData);
            var groupL = ICRender.getGroup("stairs:" + (rBlockData ^ 1));
            var currentGroup = ICRender.getGroup("stairs:" + data);
            currentGroup.add(id, data);
            var render = new ICRender.Model();
            var shape = new ICRender.CollisionShape();
            var box0 = boxes[0];
            render.addEntry(new BlockRenderer.Model(box0[0], box0[1], box0[2], box0[3], box0[4], box0[5], id, data)); // slabe box
            shape.addEntry().addBox(box0[0], box0[1], box0[2], box0[3], box0[4], box0[5]);
            var posR = conditionData.posR; // right block
            var posB = conditionData.posB; // back block
            var posF = [posB[0] * (-1), posB[1] * (-1)]; // front block
            var conditionRight = ICRender.BLOCK(posR[0], 0, posR[1], currentGroup, false);
            var conditionLeft = ICRender.BLOCK(posR[0] * (-1), 0, posR[1] * (-1), currentGroup, false);
            var conditionBackNotR = ICRender.BLOCK(posB[0], 0, posB[1], groupR, true);
            var conditionBackNotL = ICRender.BLOCK(posB[0], 0, posB[1], groupL, true);
            var box1 = getRotatedBoxVertexes(boxes[1], i);
            var model = new BlockRenderer.Model(box1[0], box1[1], box1[2], box1[3], box1[4], box1[5], id, data);
            var condition0 = ICRender.OR(conditionBackNotR, conditionLeft);
            render.addEntry(model).setCondition(condition0);
            shape.addEntry().addBox(box1[0], box1[1], box1[2], box1[3], box1[4], box1[5]).setCondition(condition0);
            var box2 = getRotatedBoxVertexes(boxes[2], i);
            var condition1 = ICRender.OR(conditionBackNotL, conditionRight);
            model = new BlockRenderer.Model(box2[0], box2[1], box2[2], box2[3], box2[4], box2[5], id, data);
            render.addEntry(model).setCondition(condition1);
            shape.addEntry().addBox(box2[0], box2[1], box2[2], box2[3], box2[4], box2[5]).setCondition(condition1);
            var box3 = getRotatedBoxVertexes(boxes[3], i);
            model = new BlockRenderer.Model(box3[0], box3[1], box3[2], box3[3], box3[4], box3[5], id, data);
            var condition2 = ICRender.AND(conditionBackNotR, conditionBackNotL, ICRender.NOT(conditionLeft), ICRender.BLOCK(posF[0], 0, posF[1], groupL, false));
            render.addEntry(model).setCondition(condition2);
            shape.addEntry().addBox(box3[0], box3[1], box3[2], box3[3], box3[4], box3[5]).setCondition(condition2);
            var box4 = getRotatedBoxVertexes(boxes[4], i);
            model = new BlockRenderer.Model(box4[0], box4[1], box4[2], box4[3], box4[4], box4[5], id, data);
            var condition3 = ICRender.AND(conditionBackNotR, conditionBackNotL, ICRender.NOT(conditionRight), ICRender.BLOCK(posF[0], 0, posF[1], groupR, false));
            render.addEntry(model).setCondition(condition3);
            shape.addEntry().addBox(box4[0], box4[1], box4[2], box4[3], box4[4], box4[5]).setCondition(condition3);
            BlockRenderer.setStaticICRender(id, data, render);
            BlockRenderer.setCustomCollisionShape(id, data, shape);
            BlockRenderer.setCustomRaycastShape(id, data, shape);
        }
    }
    BlockModeler.createStairsRenderModel = createStairsRenderModel;
    function setInventoryModel(blockID, model, data) {
        if (data === void 0) { data = 0; }
        ItemModel.getFor(blockID, data).setHandModel(model);
        ItemModel.getFor(blockID, data).setUiModel(model);
    }
    BlockModeler.setInventoryModel = setInventoryModel;
})(BlockModeler || (BlockModeler = {}));
var BlockRegistry;
(function (BlockRegistry) {
    function createBlock(nameID, defineData, blockType) {
        IDRegistry.genBlockID(nameID);
        Block.createBlock(nameID, defineData, blockType);
    }
    BlockRegistry.createBlock = createBlock;
    function createBlockWithRotation(stringID, defineData, blockType, hasVertical) {
        var numericID = IDRegistry.genBlockID(stringID);
        var variations = [];
        for (var i = 0; i < defineData.length; i++) {
            var variation = defineData[i];
            var texture = variation.texture;
            var textures = [
                [texture[3], texture[2], texture[0], texture[1], texture[4], texture[5]],
                [texture[2], texture[3], texture[1], texture[0], texture[5], texture[4]],
                [texture[0], texture[1], texture[3], texture[2], texture[5], texture[4]],
                [texture[0], texture[1], texture[2], texture[3], texture[4], texture[5]],
                [texture[0], texture[1], texture[4], texture[5], texture[3], texture[2]],
                [texture[0], texture[1], texture[5], texture[4], texture[2], texture[3]]
            ];
            for (var data = 0; data < 6; data++) {
                variations.push({ name: variation.name, texture: textures[data], inCreative: variation.inCreative && data == 0 });
            }
        }
        Block.createBlock(stringID, variations, blockType);
        for (var i = 0; i < defineData.length; i++) {
            BlockModeler.setInventoryModel(numericID, BlockRenderer.createTexturedBlock(defineData[i].texture), i * 6);
        }
        setRotationFunction(numericID, hasVertical);
    }
    BlockRegistry.createBlockWithRotation = createBlockWithRotation;
    function createStairs(stringID, defineData, blockType) {
        var numericID = IDRegistry.genBlockID(stringID);
        Block.createBlock(stringID, defineData, blockType);
        Block.registerPlaceFunction(numericID, function (coords, item, block, player, region) {
            var place = getPlacePosition(coords, block, region);
            if (!place)
                return;
            var data = getBlockRotation(player) - 2;
            if (coords.side == 0 || coords.side >= 2 && coords.vec.y - coords.y >= 0.5) {
                data += 4;
            }
            region.setBlock(place.x, place.y, place.z, item.id, data);
            //World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8);
            return place;
        });
        BlockModeler.setStairsRenderModel(numericID);
        var model = BlockRenderer.createModel();
        model.addBox(0, 0, 0, 1, 0.5, 1, numericID, 0);
        model.addBox(0, 0.5, 0, 1, 1, 0.5, numericID, 0);
        BlockModeler.setInventoryModel(numericID, model);
    }
    BlockRegistry.createStairs = createStairs;
    function getBlockRotation(player, hasVertical) {
        var pitch = EntityGetPitch(player);
        if (hasVertical) {
            if (pitch < -45)
                return 0;
            if (pitch > 45)
                return 1;
        }
        var rotation = Math.floor((EntityGetYaw(player) - 45) % 360 / 90);
        if (rotation < 0)
            rotation += 4;
        rotation = [5, 3, 4, 2][rotation];
        return rotation;
    }
    BlockRegistry.getBlockRotation = getBlockRotation;
    function getPlacePosition(coords, block, region) {
        if (World.canTileBeReplaced(block.id, block.data))
            return coords;
        var place = coords.relative;
        block = region.getBlock(place.x, place.y, place.z);
        if (World.canTileBeReplaced(block.id, block.data))
            return place;
        return null;
    }
    BlockRegistry.getPlacePosition = getPlacePosition;
    function setRotationFunction(id, hasVertical, placeSound) {
        Block.registerPlaceFunction(id, function (coords, item, block, player, region) {
            var place = getPlacePosition(coords, block, region);
            if (!place)
                return;
            var rotation = getBlockRotation(player, hasVertical);
            region.setBlock(place.x, place.y, place.z, item.id, (item.data - item.data % 6) + rotation);
            //World.playSound(place.x, place.y, place.z, placeSound || "dig.stone", 1, 0.8);
            return place;
        });
    }
    BlockRegistry.setRotationFunction = setRotationFunction;
    function registerDrop(nameID, dropFunc, level) {
        Block.registerDropFunction(nameID, function (blockCoords, blockID, blockData, diggingLevel, enchant, item, region) {
            if (!level || diggingLevel >= level) {
                return dropFunc(blockCoords, blockID, blockData, diggingLevel, enchant, item, region);
            }
            return [];
        });
        addBlockDropOnExplosion(nameID);
    }
    BlockRegistry.registerDrop = registerDrop;
    function setDestroyLevel(nameID, level) {
        Block.registerDropFunction(nameID, function (сoords, blockID, blockData, diggingLevel) {
            if (diggingLevel >= level) {
                return [[Block.getNumericId(nameID), 1, 0]];
            }
        });
        addBlockDropOnExplosion(nameID);
    }
    BlockRegistry.setDestroyLevel = setDestroyLevel;
    function registerOnExplosionFunction(nameID, func) {
        Block.registerPopResourcesFunction(nameID, func);
    }
    BlockRegistry.registerOnExplosionFunction = registerOnExplosionFunction;
    function addBlockDropOnExplosion(nameID) {
        Block.registerPopResourcesFunction(nameID, function (coords, block, region) {
            if (Math.random() >= 0.25)
                return;
            var dropFunc = Block.getDropFunction(block.id);
            var enchant = ToolAPI.getEnchantExtraData();
            var item = new ItemStack();
            //@ts-ignore
            var drop = dropFunc(coords, block.id, block.data, 127, enchant, item, region);
            for (var _i = 0, drop_2 = drop; _i < drop_2.length; _i++) {
                var item_1 = drop_2[_i];
                region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, item_1[0], item_1[1], item_1[2], item_1[3] || null);
            }
        });
    }
    BlockRegistry.addBlockDropOnExplosion = addBlockDropOnExplosion;
    var noDropBlocks = [26, 30, 31, 32, 51, 59, 92, 99, 100, 104, 105, 106, 115, 127, 132, 141, 142, 144, 161, 175, 199, 244, 385, 386, 388, 389, 390, 391, 392, 462];
    function getBlockDrop(x, y, z, block, level, item, region) {
        var id = block.id, data = block.data;
        var enchant = ToolAPI.getEnchantExtraData(item.extra);
        //@ts-ignore
        var dropFunc = Block.dropFunctions[id];
        if (dropFunc) {
            region !== null && region !== void 0 ? region : (region = BlockSource.getDefaultForActor(Player.get()));
            return dropFunc(new Vector3(x, y, z), id, data, level, enchant, item, region);
        }
        if (id == 3 || id == 5 || id == 6 || id == 12 || id == 19 || id == 35 || id == 85 || id == 158 || id == 171)
            return [[id, 1, data]];
        if (id == 17 || id == 162)
            return [[id, 1, data]]; // log
        if (id == 18 || id == 161) { // leaves
            if (enchant.silk)
                return [[id, 1, data]];
            return [];
        }
        if (id == 47) { // bookshelf
            if (enchant.silk)
                return [[id, 1, 0]];
            return [[340, 3, 0]];
        }
        if (id == 55)
            return [[331, 1, 0]]; // redstone wire
        if (id == 60)
            return [[3, 1, 0]]; // farmland
        if (id == 63 || id == 68)
            return [[338, 1, 0]]; // sign
        if (id == 64)
            return [[324, 1, 0]]; // door
        if (id == 75 || id == 76)
            return [[76, 1, 0]]; // redstone torch
        if (id == 79) { // ice
            if (enchant.silk)
                return [[id, 1, 0]];
            return [];
        }
        if (id == 83)
            return [[338, 1, 0]]; // sugar canes
        if (id == 89)
            return [[348, Math.floor(Math.random() * 3 + 2), 0]]; // glowstone
        if (id == 93 || id == 94)
            return [[356, 1, 0]]; // repeater
        if (id == 103)
            return [[360, Math.floor(Math.random() * 4 + 4), 0]]; // melon
        if (id == 123 || id == 124)
            return [[123, 1, 0]]; // redstone lamp
        if (id == 140)
            return [[390, 1, 0]]; // pot
        if (id == 149 || id == 150)
            return [[404, 1, 0]]; // comparator
        if (id == 151 || id == 178)
            return [[151, 1, 0]]; // daylight detector
        // doors
        if (id == 193)
            return [[427, 1, 0]];
        if (id == 194)
            return [[428, 1, 0]];
        if (id == 195)
            return [[429, 1, 0]];
        if (id == 196)
            return [[430, 1, 0]];
        if (id == 197)
            return [[431, 1, 0]];
        if (id == 393)
            return [[335, 1, 0]]; // kelp
        if (id == VanillaTileID.campfire) {
            if (enchant.silk)
                return [[id, 1, 0]];
            var item_2 = IDConverter.getIDData("charcoal");
            return [[item_2.id, 1, item_2.data]];
        }
        if (id == VanillaTileID.soul_campfire) {
            if (enchant.silk)
                return [[id, 1, 0]];
            return [[VanillaTileID.soul_soil, 1, 0]];
        }
        // signs
        if (id == 436 || id == 437)
            return [[472, 1, 0]];
        if (id == 441 || id == 442)
            return [[473, 1, 0]];
        if (id == 443 || id == 444)
            return [[474, 1, 0]];
        if (id == 445 || id == 446)
            return [[475, 1, 0]];
        if (id == 447 || id == 448)
            return [[476, 1, 0]];
        if (id == 467)
            return [[-212, 1, data]]; // wood
        if (noDropBlocks.indexOf(id) != -1)
            return [];
        return [[Block.convertBlockToItemId(id), 1, 0]];
    }
    BlockRegistry.getBlockDrop = getBlockDrop;
})(BlockRegistry || (BlockRegistry = {}));
var ItemStack = /** @class */ (function () {
    function ItemStack(item, count, data, extra) {
        if (typeof item == "object") {
            this.id = item.id;
            this.data = item.data;
            this.count = item.count;
            this.extra = item.extra || null;
        }
        else {
            this.id = item || 0;
            this.data = data || 0;
            this.count = count || 0;
            this.extra = extra || null;
        }
    }
    ItemStack.prototype.getItemInstance = function () {
        return ItemRegistry.getInstanceOf(this.id);
    };
    ItemStack.prototype.getMaxStack = function () {
        return Item.getMaxStack(this.id);
    };
    ItemStack.prototype.getMaxDamage = function () {
        return Item.getMaxDamage(this.id);
    };
    /**
     * Decreases stack count by specified value.
     * @param count amount to decrease
     */
    ItemStack.prototype.decrease = function (count) {
        this.count -= count;
        if (this.count <= 0)
            this.clear();
    };
    /**
     * Sets all stack values to 0.
     */
    ItemStack.prototype.clear = function () {
        this.id = this.data = this.count = 0;
        this.extra = null;
    };
    /**
     * Applies damage to the item and destroys it if its max damage reached
     * @param damage amount to apply
     */
    ItemStack.prototype.applyDamage = function (damage) {
        var unbreakingLevel = this.getEnchantLevel(Native.Enchantment.UNBREAKING);
        if (Math.random() < 1 / (unbreakingLevel + 1)) {
            this.data += damage;
        }
        if (this.data >= this.getMaxDamage()) {
            var tool = ToolAPI.getToolData(this.id);
            if (tool && tool.brokenId) {
                this.id = tool.brokenId;
                this.data = 0;
                this.extra = null;
            }
            else {
                this.clear();
            }
        }
    };
    /**
     * @returns item's custom name
     */
    ItemStack.prototype.getCustomName = function () {
        var _a;
        return ((_a = this.extra) === null || _a === void 0 ? void 0 : _a.getCustomName()) || "";
    };
    /**
    * Sets item's custom name. Creates new ItemExtraData instance if
    * it doesn't exist.
    */
    ItemStack.prototype.setCustomName = function (name) {
        var _a;
        (_a = this.extra) !== null && _a !== void 0 ? _a : (this.extra = new ItemExtraData());
        this.extra.setCustomName(name);
    };
    /**
     * @returns true if the item is enchanted, false otherwise
     */
    ItemStack.prototype.isEnchanted = function () {
        var _a;
        return ((_a = this.extra) === null || _a === void 0 ? void 0 : _a.isEnchanted()) || false;
    };
    /**
     * Adds a new enchantment to the item. Creates new ItemExtraData instance if
     * it doesn't exist.
     * @param id enchantment id, one of the Native.Enchantment constants
     * @param level enchantment level, generally between 1 and 5
     */
    ItemStack.prototype.addEnchant = function (id, level) {
        var _a;
        (_a = this.extra) !== null && _a !== void 0 ? _a : (this.extra = new ItemExtraData());
        this.extra.addEnchant(id, level);
    };
    /**
     * Removes enchantments by its id
     * @param id enchantment id, one of the Native.Enchantment constants
     */
    ItemStack.prototype.removeEnchant = function (id) {
        var _a;
        (_a = this.extra) === null || _a === void 0 ? void 0 : _a.removeEnchant(id);
    };
    /**
     * Removes all the enchantments of the item
     */
    ItemStack.prototype.removeAllEnchants = function () {
        var _a;
        (_a = this.extra) === null || _a === void 0 ? void 0 : _a.removeAllEnchants();
    };
    /**
     * @param id enchantment id, one of the Native.Enchantment constants
     * @returns level of the specified enchantment
     */
    ItemStack.prototype.getEnchantLevel = function (id) {
        var _a;
        return ((_a = this.extra) === null || _a === void 0 ? void 0 : _a.getEnchantLevel(id)) || 0;
    };
    /**
     * @returns all the enchantments of the item in the readable format
     */
    ItemStack.prototype.getEnchants = function () {
        var _a;
        return ((_a = this.extra) === null || _a === void 0 ? void 0 : _a.getEnchants()) || null;
    };
    return ItemStack;
}());
var ItemBase = /** @class */ (function () {
    function ItemBase(stringID, name, icon) {
        this.maxStack = 64;
        this.maxDamage = 0;
        this.inCreative = false;
        this.stringID = stringID;
        this.id = IDRegistry.genItemID(stringID);
        this.setName(name || stringID);
        if (typeof icon == "string")
            this.setIcon(icon);
        else if (typeof icon == "object")
            this.setIcon(icon.name, icon.meta || icon.data);
        else
            this.setIcon("missing_icon");
    }
    ItemBase.prototype.setName = function (name) {
        this.name = name;
    };
    ItemBase.prototype.setIcon = function (texture, index) {
        if (index === void 0) { index = 0; }
        this.icon = { name: texture, meta: index };
    };
    /**
     * Sets item creative category
     * @param category item category, should be integer from 1 to 4.
     */
    ItemBase.prototype.setCategory = function (category) {
        Item.setCategory(this.id, category);
    };
    /**
     * Sets item maximum stack size
     * @param maxStack maximum stack size for the item
     */
    ItemBase.prototype.setMaxStack = function (maxStack) {
        this.maxStack = maxStack;
        this.item.setMaxStackSize(maxStack);
    };
    /**
     * Sets item maximum data value
     * @param maxDamage maximum data value for the item
     */
    ItemBase.prototype.setMaxDamage = function (maxDamage) {
        this.maxDamage = maxDamage;
        this.item.setMaxDamage(maxDamage);
    };
    /**
    * Specifies how the player should hold the item
    * @param enabled if true, player holds the item as a tool, not as a simple
    * item
    */
    ItemBase.prototype.setHandEquipped = function (enabled) {
        this.item.setHandEquipped(enabled);
    };
    /**
     * Allows item to be put in off hand
     */
    ItemBase.prototype.allowInOffHand = function () {
        this.item.setAllowedInOffhand(true);
    };
    /**
     * Allows item to click on liquid blocks
     */
    ItemBase.prototype.setLiquidClip = function () {
        this.item.setLiquidClip(true);
    };
    /**
     * Specifies how the item can be enchanted
     * @param type enchant type defining whan enchants can or cannot be
     * applied to this item, one of the Native.EnchantType
     * @param enchantability quality of the enchants that are applied, the higher this
     * value is, the better enchants you get with the same level
     */
    ItemBase.prototype.setEnchantType = function (type, enchantability) {
        this.item.setEnchantType(type, enchantability);
    };
    /**
     * Sets item as glint (like enchanted tools or golden apple)
     * @param enabled if true, the item will be displayed as glint item
     */
    ItemBase.prototype.setGlint = function (enabled) {
        this.item.setGlint(enabled);
    };
    /**
     * Adds material that can be used to repair the item in the anvil
     * @param itemID item id to be used as repair material
     */
    ItemBase.prototype.addRepairItem = function (itemID) {
        this.item.addRepairItem(itemID);
    };
    ItemBase.prototype.setRarity = function (rarity) {
        ItemRegistry.setRarity(this.id, rarity);
    };
    ItemBase.prototype.addDefaultToCreative = function () {
        var _a;
        var wasInCreative = (_a = ItemRegistry.getInstanceOf(this.id)) === null || _a === void 0 ? void 0 : _a.inCreative;
        if (!wasInCreative) {
            Item.addToCreative(this.id, 1, 0);
            this.inCreative = true;
        }
    };
    return ItemBase;
}());
var ItemCommon = /** @class */ (function (_super) {
    __extends(ItemCommon, _super);
    function ItemCommon(stringID, name, icon, inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.item = Item.createItem(_this.stringID, _this.name, _this.icon, { isTech: true });
        _this.setCategory(ItemCategory.ITEMS);
        if (inCreative)
            _this.addDefaultToCreative();
        return _this;
    }
    return ItemCommon;
}(ItemBase));
var ItemFood = /** @class */ (function (_super) {
    __extends(ItemFood, _super);
    function ItemFood(stringID, name, icon, food, inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.item = Item.createFoodItem(_this.stringID, _this.name, _this.icon, { food: food, isTech: true });
        _this.setCategory(ItemCategory.ITEMS);
        if (inCreative)
            _this.addDefaultToCreative();
        return _this;
    }
    ItemFood.prototype.onFoodEaten = function (item, food, saturation, player) { };
    return ItemFood;
}(ItemBase));
Callback.addCallback("FoodEaten", function (food, saturation, player) {
    var item = Entity.getCarriedItem(player);
    var itemInstance = ItemRegistry.getInstanceOf(item.id);
    if (itemInstance && itemInstance.onFoodEaten) {
        itemInstance.onFoodEaten(item, food, saturation, player);
    }
});
var ItemThrowable = /** @class */ (function (_super) {
    __extends(ItemThrowable, _super);
    function ItemThrowable(stringID, name, icon, inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.item = Item.createThrowableItem(_this.stringID, _this.name, _this.icon, { isTech: true });
        _this.setCategory(ItemCategory.ITEMS);
        if (inCreative)
            _this.addDefaultToCreative();
        Item.registerThrowableFunctionForID(_this.id, function (projectile, item, target) {
            _this.onProjectileHit(projectile, item, target);
        });
        return _this;
    }
    ItemThrowable.prototype.onProjectileHit = function (projectile, item, target) { };
    return ItemThrowable;
}(ItemBase));
var ItemArmor = /** @class */ (function (_super) {
    __extends(ItemArmor, _super);
    function ItemArmor(stringID, name, icon, params, inCreative) {
        if (inCreative === void 0) { inCreative = true; }
        var _this = _super.call(this, stringID, name, icon) || this;
        _this.armorType = params.type;
        _this.defence = params.defence;
        _this.setArmorTexture(params.texture);
        _this.item = Item.createArmorItem(_this.stringID, _this.name, _this.icon, {
            type: _this.armorType,
            armor: _this.defence,
            durability: 0,
            texture: _this.texture,
            isTech: true
        });
        _this.inCreative = inCreative;
        if (params.material)
            _this.setMaterial(params.material);
        if (inCreative)
            _this.addDefaultToCreative();
        ItemArmor.registerListeners(_this.id, _this);
        return _this;
    }
    ItemArmor.prototype.setArmorTexture = function (texture) {
        this.texture = texture;
    };
    ItemArmor.prototype.setMaterial = function (armorMaterial) {
        if (typeof armorMaterial == "string") {
            armorMaterial = ItemRegistry.getArmorMaterial(armorMaterial);
        }
        this.armorMaterial = armorMaterial;
        var index = Native.ArmorType[this.armorType];
        var maxDamage = armorMaterial.durabilityFactor * ItemArmor.maxDamageArray[index];
        this.setMaxDamage(maxDamage);
        if (armorMaterial.enchantability) {
            this.setEnchantType(Native.EnchantType[this.armorType], armorMaterial.enchantability);
        }
        if (armorMaterial.repairMaterial) {
            this.addRepairItem(armorMaterial.repairMaterial);
        }
    };
    ItemArmor.prototype.preventDamaging = function () {
        Armor.preventDamaging(this.id);
    };
    ItemArmor.registerListeners = function (id, armorFuncs) {
        if ('onHurt' in armorFuncs) {
            Armor.registerOnHurtListener(id, function (item, slot, player, type, value, attacker, bool1, bool2) {
                return armorFuncs.onHurt({ attacker: attacker, type: type, damage: value, bool1: bool1, bool2: bool2 }, item, slot, player);
            });
        }
        if ('onTick' in armorFuncs) {
            Armor.registerOnTickListener(id, function (item, slot, player) {
                return armorFuncs.onTick(item, slot, player);
            });
        }
        if ('onTakeOn' in armorFuncs) {
            Armor.registerOnTakeOnListener(id, function (item, slot, player) {
                armorFuncs.onTakeOn(item, slot, player);
            });
        }
        if ('onTakeOff' in armorFuncs) {
            Armor.registerOnTakeOffListener(id, function (item, slot, player) {
                armorFuncs.onTakeOff(item, slot, player);
            });
        }
    };
    ItemArmor.maxDamageArray = [11, 16, 15, 13];
    return ItemArmor;
}(ItemBase));
var ToolType;
(function (ToolType) {
    ToolType.SWORD = {
        handEquipped: true,
        isWeapon: true,
        enchantType: Native.EnchantType.weapon,
        damage: 4,
        blockTypes: ["fibre", "plant"],
        calcDestroyTime: function (item, coords, block, params, destroyTime, enchant) {
            if (block.id == 30)
                return 0.08;
            var material = ToolAPI.getBlockMaterialName(block.id);
            if (material == "plant" || block.id == 86 || block.id == 91 || block.id == 103 || block.id == 127 || block.id == 410) {
                return params.base / 1.5;
            }
            return destroyTime;
        }
    };
    ToolType.SHOVEL = {
        handEquipped: true,
        enchantType: Native.EnchantType.shovel,
        damage: 2,
        blockTypes: ["dirt"],
        onItemUse: function (coords, item, block, player) {
            if (block.id == 2 && coords.side == 1) {
                var region = WorldRegion.getForActor(player);
                region.setBlock(coords, 198, 0);
                region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.grass", 0.5, 0.8);
                item.applyDamage(1);
                Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
            }
        }
    };
    ToolType.PICKAXE = {
        handEquipped: true,
        enchantType: Native.EnchantType.pickaxe,
        damage: 2,
        blockTypes: ["stone"],
    };
    ToolType.AXE = {
        handEquipped: true,
        enchantType: Native.EnchantType.axe,
        damage: 3,
        blockTypes: ["wood"],
        onItemUse: function (coords, item, block, player) {
            var region = WorldRegion.getForActor(player);
            var logID;
            if (block.id == 17) {
                if (block.data == 0)
                    logID = VanillaTileID.stripped_oak_log;
                if (block.data == 1)
                    logID = VanillaTileID.stripped_spruce_log;
                if (block.data == 2)
                    logID = VanillaTileID.stripped_birch_log;
                if (block.data == 3)
                    logID = VanillaTileID.stripped_jungle_log;
            }
            else if (block.id == 162) {
                if (block.data == 0)
                    logID = VanillaTileID.stripped_acacia_log;
                else
                    logID = VanillaTileID.stripped_dark_oak_log;
            }
            if (logID) {
                region.setBlock(coords, logID, 0);
                item.applyDamage(1);
                Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
            }
        }
    };
    ToolType.HOE = {
        handEquipped: true,
        enchantType: Native.EnchantType.pickaxe,
        damage: 2,
        blockTypes: ["plant"],
        onItemUse: function (coords, item, block, player) {
            if ((block.id == 2 || block.id == 3) && coords.side != 0) {
                var region = WorldRegion.getForActor(player);
                if (region.getBlockId(coords.x, coords.y + 1, coords.z) != 0)
                    return;
                region.setBlock(coords, 60, 0);
                region.playSound(coords.x + .5, coords.y + 1, coords.z + .5, "step.gravel", 1, 0.8);
                item.applyDamage(1);
                Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra);
            }
        }
    };
    ToolType.SHEARS = {
        blockTypes: ["plant", "fibre", "wool"],
        modifyEnchant: function (enchantData, item, coords, block) {
            if (block) {
                var material = ToolAPI.getBlockMaterialName(block.id);
                if (material == "fibre" || material == "plant") {
                    enchantData.silk = true;
                }
            }
        },
        calcDestroyTime: function (item, coords, block, params, destroyTime, enchant) {
            if (block.id == 30)
                return 0.08;
            return destroyTime;
        },
        onDestroy: function (item, coords, block, player) {
            if (block.id == 31 || block.id == 32 || block.id == 18 || block.id == 161) {
                var region = WorldRegion.getForActor(player);
                region.destroyBlock(coords);
                region.dropItem(coords.x + .5, coords.y + .5, coords.z + .5, block.id, 1, block.data);
            }
            return false;
        }
    };
})(ToolType || (ToolType = {}));
ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");
/// <reference path="ToolType.ts" />
var ItemTool = /** @class */ (function (_super) {
    __extends(ItemTool, _super);
    function ItemTool(stringID, name, icon, toolMaterial, toolData, inCreative) {
        var _this = _super.call(this, stringID, name, icon, inCreative) || this;
        _this.handEquipped = false;
        _this.brokenId = 0;
        _this.damage = 0;
        _this.isWeapon = false;
        _this.blockTypes = [];
        _this.setMaxStack(1);
        _this.setCategory(ItemCategory.EQUIPMENT);
        if (typeof toolMaterial == "string") {
            toolMaterial = ItemRegistry.getToolMaterial(toolMaterial);
        }
        _this.toolMaterial = toolMaterial;
        if (toolData) {
            for (var key in toolData) {
                _this[key] = toolData[key];
            }
        }
        ToolAPI.registerTool(_this.id, _this.toolMaterial, _this.blockTypes, _this);
        if (_this.enchantType && toolMaterial.enchantability) {
            _this.setEnchantType(_this.enchantType, toolMaterial.enchantability);
        }
        if (toolMaterial.repairMaterial) {
            _this.addRepairItem(toolMaterial.repairMaterial);
        }
        if (_this.handEquipped) {
            _this.setHandEquipped(true);
        }
        return _this;
    }
    return ItemTool;
}(ItemCommon));
/// <reference path="ItemBase.ts" />
/// <reference path="ItemCommon.ts" />
/// <reference path="ItemFood.ts" />
/// <reference path="ItemThrowable.ts" />
/// <reference path="ItemArmor.ts" />
/// <reference path="ItemTool.ts" />
var ItemRegistry;
(function (ItemRegistry) {
    var items = {};
    var itemsRarity = {};
    var armorMaterials = {};
    function getType(id) {
        return IDRegistry.getIdInfo(id).split(":")[0];
    }
    ItemRegistry.getType = getType;
    function isBlock(id) {
        return getType(id) == "block";
    }
    ItemRegistry.isBlock = isBlock;
    function isItem(id) {
        return getType(id) == "item";
    }
    ItemRegistry.isItem = isItem;
    function isVanilla(id) {
        return !IDRegistry.getNameByID(id);
    }
    ItemRegistry.isVanilla = isVanilla;
    function getVanillaStringID(id) {
        return IDRegistry.getIdInfo(id).split(":")[1].split("#")[0];
    }
    ItemRegistry.getVanillaStringID = getVanillaStringID;
    function getInstanceOf(itemID) {
        var numericID = Item.getNumericId(itemID);
        return items[numericID] || null;
    }
    ItemRegistry.getInstanceOf = getInstanceOf;
    /**
     * @returns EnumRarity value for item
     * @param itemID item's id
     */
    function getRarity(itemID) {
        var _a;
        return (_a = itemsRarity[itemID]) !== null && _a !== void 0 ? _a : EnumRarity.COMMON;
    }
    ItemRegistry.getRarity = getRarity;
    /**
     * @returns chat color for rarity
     * @param rarity one of EnumRarity values
     */
    function getRarityColor(rarity) {
        if (rarity == EnumRarity.UNCOMMON)
            return "§e";
        if (rarity == EnumRarity.RARE)
            return "§b";
        if (rarity == EnumRarity.EPIC)
            return "§d";
        return "";
    }
    ItemRegistry.getRarityColor = getRarityColor;
    /**
     * @returns chat color for item's rarity
     * @param itemID item's id
     */
    function getItemRarityColor(itemID) {
        return getRarityColor(getRarity(itemID));
    }
    ItemRegistry.getItemRarityColor = getItemRarityColor;
    function setRarity(id, rarity, preventNameOverride) {
        var numericID = Item.getNumericId(id);
        itemsRarity[numericID] = rarity;
        //@ts-ignore
        if (!preventNameOverride && !Item.nameOverrideFunctions[numericID]) {
            Item.registerNameOverrideFunction(numericID, function (item, translation, name) {
                return getItemRarityColor(item.id) + translation;
            });
        }
    }
    ItemRegistry.setRarity = setRarity;
    function addArmorMaterial(name, material) {
        armorMaterials[name] = material;
    }
    ItemRegistry.addArmorMaterial = addArmorMaterial;
    function getArmorMaterial(name) {
        return armorMaterials[name];
    }
    ItemRegistry.getArmorMaterial = getArmorMaterial;
    function addToolMaterial(name, material) {
        ToolAPI.addToolMaterial(name, material);
    }
    ItemRegistry.addToolMaterial = addToolMaterial;
    function getToolMaterial(name) {
        //@ts-ignore
        return ToolAPI.toolMaterials[name];
    }
    ItemRegistry.getToolMaterial = getToolMaterial;
    function registerItem(itemInstance) {
        items[itemInstance.id] = itemInstance;
        registerItemFuncs(itemInstance.id, itemInstance);
        return itemInstance;
    }
    ItemRegistry.registerItem = registerItem;
    function registerItemFuncs(itemID, itemFuncs) {
        if ('onNameOverride' in itemFuncs) {
            Item.registerNameOverrideFunction(itemID, function (item, translation, name) {
                return getItemRarityColor(item.id) + itemFuncs.onNameOverride(item, translation, name);
            });
        }
        if ('onIconOverride' in itemFuncs) {
            Item.registerIconOverrideFunction(itemID, function (item, isModUi) {
                return itemFuncs.onIconOverride(item, isModUi);
            });
        }
        if ('onItemUse' in itemFuncs) {
            Item.registerUseFunction(itemID, function (coords, item, block, player) {
                itemFuncs.onItemUse(coords, new ItemStack(item), block, player);
            });
        }
        if ('onNoTargetUse' in itemFuncs) {
            Item.registerNoTargetUseFunction(itemID, function (item, player) {
                itemFuncs.onNoTargetUse(new ItemStack(item), player);
            });
        }
        if ('onUsingReleased' in itemFuncs) {
            Item.registerUsingReleasedFunction(itemID, function (item, ticks, player) {
                itemFuncs.onUsingReleased(new ItemStack(item), ticks, player);
            });
        }
        if ('onUsingComplete' in itemFuncs) {
            Item.registerUsingCompleteFunction(itemID, function (item, player) {
                itemFuncs.onUsingComplete(new ItemStack(item), player);
            });
        }
        if ('onDispense' in itemFuncs) {
            Item.registerDispenseFunction(itemID, function (coords, item, blockSource) {
                var region = new WorldRegion(blockSource);
                itemFuncs.onDispense(coords, new ItemStack(item), region);
            });
        }
    }
    ItemRegistry.registerItemFuncs = registerItemFuncs;
    function createItem(stringID, params) {
        var item = getInstanceOf(stringID);
        if (params.type == "food") {
            item = new ItemFood(stringID, params.name, params.icon, params.food, params.inCreative);
        }
        else if (params.type == "throwable") {
            item = new ItemThrowable(stringID, params.name, params.icon, params.inCreative);
        }
        else {
            item = new ItemCommon(stringID, params.name, params.icon, params.inCreative);
        }
        item.setCategory(params.category || ItemCategory.ITEMS);
        if (params.stack)
            item.setMaxStack(params.stack);
        if (params.maxDamage)
            item.setMaxDamage(params.maxDamage);
        if (params.handEquipped)
            item.setHandEquipped(true);
        if (params.allowedInOffhand)
            item.allowInOffHand();
        if (params.glint)
            item.setGlint(true);
        if (params.enchant)
            item.setEnchantType(params.enchant.type, params.enchant.value);
        if (params.rarity)
            item.setRarity(params.rarity);
        items[item.id] = item;
        return item;
    }
    ItemRegistry.createItem = createItem;
    ;
    function createArmor(stringID, params) {
        var item = new ItemArmor(stringID, params.name, params.icon, params, params.inCreative);
        registerItem(item);
        if (params.category)
            item.setCategory(params.category);
        if (params.glint)
            item.setGlint(true);
        if (params.rarity)
            item.setRarity(params.rarity);
        return item;
    }
    ItemRegistry.createArmor = createArmor;
    ;
    function createTool(stringID, params, toolData) {
        var item = new ItemTool(stringID, params.name, params.icon, params.material, toolData, params.inCreative);
        registerItem(item);
        if (params.category)
            item.setCategory(params.category);
        if (params.glint)
            item.setGlint(true);
        if (params.rarity)
            item.setRarity(params.rarity);
        return item;
    }
    ItemRegistry.createTool = createTool;
})(ItemRegistry || (ItemRegistry = {}));
// By NikolaySavenko (https://github.com/NikolaySavenko)
var IDConverter;
(function (IDConverter) {
    var oldIDPairs = {};
    function registerOld(stringId, oldId, oldData) {
        oldIDPairs[stringId] = { id: oldId, data: oldData };
    }
    IDConverter.registerOld = registerOld;
    function getStack(stringId, count, data, extra) {
        if (count === void 0) { count = 1; }
        if (data === void 0) { data = 0; }
        if (extra === void 0) { extra = null; }
        if (BlockEngine.getMainGameVersion() == 11) {
            var oldPair = oldIDPairs[stringId];
            if (oldPair) {
                return new ItemStack(oldPair.id, count, oldPair.data, extra);
            }
        }
        return new ItemStack(VanillaItemID[stringId] || VanillaBlockID[stringId], count, data, extra);
    }
    IDConverter.getStack = getStack;
    function getIDData(stringId) {
        if (BlockEngine.getMainGameVersion() == 11) {
            return oldIDPairs[stringId];
        }
        else {
            return { id: VanillaItemID[stringId] || VanillaBlockID[stringId], data: 0 };
        }
    }
    IDConverter.getIDData = getIDData;
    function getID(stringId) {
        if (BlockEngine.getMainGameVersion() == 11)
            return oldIDPairs[stringId].id;
        else
            return VanillaItemID[stringId] || VanillaBlockID[stringId];
    }
    IDConverter.getID = getID;
    function getData(stringId) {
        if (BlockEngine.getMainGameVersion() == 11)
            return oldIDPairs[stringId].data;
        else
            return 0;
    }
    IDConverter.getData = getData;
})(IDConverter || (IDConverter = {}));
/// <reference path="IDConverter.ts" />
IDConverter.registerOld("charcoal", 263, 1);
IDConverter.registerOld("oak_boat", 333, 0);
IDConverter.registerOld("spruce_boat", 333, 1);
IDConverter.registerOld("birch_boat", 333, 2);
IDConverter.registerOld("jungle_boat", 333, 3);
IDConverter.registerOld("acacia_boat", 333, 4);
IDConverter.registerOld("dark_oak_boat", 333, 5);
IDConverter.registerOld("milk_bucket", 325, 1);
IDConverter.registerOld("water_bucket", 325, 8);
IDConverter.registerOld("lava_bucket", 325, 10);
IDConverter.registerOld("ink_sac", 351, 0);
IDConverter.registerOld("red_dye", 351, 1);
IDConverter.registerOld("green_dye", 351, 2);
IDConverter.registerOld("cocoa_beans", 351, 3);
IDConverter.registerOld("lapis_lazuli", 351, 4);
IDConverter.registerOld("purple_dye", 351, 5);
IDConverter.registerOld("cyan_dye", 351, 6);
IDConverter.registerOld("light_gray_dye", 351, 7);
IDConverter.registerOld("gray_dye", 351, 8);
IDConverter.registerOld("pink_dye", 351, 9);
IDConverter.registerOld("lime_dye", 351, 10);
IDConverter.registerOld("yellow_dye", 351, 11);
IDConverter.registerOld("light_blue_dye", 351, 12);
IDConverter.registerOld("magenta_dye", 351, 13);
IDConverter.registerOld("orange_dye", 351, 14);
IDConverter.registerOld("bone_meal", 351, 15);
IDConverter.registerOld("black_dye", 351, 16);
IDConverter.registerOld("brown_dye", 351, 17);
IDConverter.registerOld("blue_dye", 351, 18);
IDConverter.registerOld("white_dye", 351, 19);
IDConverter.registerOld("cooked_cod", VanillaItemID.cooked_fish, 0);
IDConverter.registerOld("cod", VanillaItemID.fish, 0);
IDConverter.registerOld("tropical_fish", VanillaItemID.clownfish, 0);
IDConverter.registerOld("melon_slice", VanillaItemID.melon, 0);
IDConverter.registerOld("leather_horse_armor", VanillaItemID.horsearmorleather, 0);
IDConverter.registerOld("iron_horse_armor", VanillaItemID.horsearmoriron, 0);
IDConverter.registerOld("golden_horse_armor", VanillaItemID.horsearmorgold, 0);
IDConverter.registerOld("diamond_horse_armor", VanillaItemID.horsearmordiamond, 0);
IDConverter.registerOld("mutton", VanillaItemID.muttonraw, 0);
IDConverter.registerOld("cooked_mutton", VanillaItemID.muttoncooked, 0);
IDConverter.registerOld("totem_of_undying", VanillaItemID.totem, 0);
IDConverter.registerOld("music_disc_13", VanillaItemID.record_13, 0);
IDConverter.registerOld("music_disc_cat", VanillaItemID.record_cat, 0);
IDConverter.registerOld("music_disc_blocks", VanillaItemID.record_blocks, 0);
IDConverter.registerOld("music_disc_chirp", VanillaItemID.record_chirp, 0);
IDConverter.registerOld("music_disc_far", VanillaItemID.record_far, 0);
IDConverter.registerOld("music_disc_mall", VanillaItemID.record_mall, 0);
IDConverter.registerOld("music_disc_mellohi", VanillaItemID.record_mellohi, 0);
IDConverter.registerOld("music_disc_stal", VanillaItemID.record_stal, 0);
IDConverter.registerOld("music_disc_strad", VanillaItemID.record_strad, 0);
IDConverter.registerOld("music_disc_ward", VanillaItemID.record_ward, 0);
IDConverter.registerOld("music_disc_11", VanillaItemID.record_11, 0);
IDConverter.registerOld("music_disc_wait", VanillaItemID.record_wait, 0);
var TileEntityBase = /** @class */ (function () {
    function TileEntityBase() {
        var _a;
        this.useNetworkItemContainer = true;
        this._clickPrevented = false;
        (_a = this.client) !== null && _a !== void 0 ? _a : (this.client = {});
        this.client.load = this.clientLoad;
        this.client.unload = this.clientUnload;
        this.client.tick = this.clientTick;
    }
    TileEntityBase.prototype.created = function () {
        this.onCreate();
    };
    TileEntityBase.prototype.init = function () {
        this.region = new WorldRegion(this.blockSource);
        this.onInit();
    };
    TileEntityBase.prototype.load = function () {
        this.onLoad();
    };
    TileEntityBase.prototype.unload = function () {
        this.onUnload();
    };
    TileEntityBase.prototype.tick = function () {
        this.onTick();
    };
    /**
     * Called when a TileEntity is created
     */
    TileEntityBase.prototype.onCreate = function () { };
    /**
     * Called when a TileEntity is initialised in the world
     */
    TileEntityBase.prototype.onInit = function () { };
    /**
     * Called when a chunk with TileEntity is loaded
     */
    TileEntityBase.prototype.onLoad = function () { };
    /**
     * Called when a chunk with TileEntity is unloaded
     */
    TileEntityBase.prototype.onUnload = function () { };
    /**
     * Called every tick and should be used for all the updates of the TileEntity
     */
    TileEntityBase.prototype.onTick = function () { };
    TileEntityBase.prototype.clientLoad = function () { };
    TileEntityBase.prototype.clientUnload = function () { };
    TileEntityBase.prototype.clientTick = function () { };
    TileEntityBase.prototype.onCheckerTick = function (isInitialized, isLoaded, wasLoaded) { };
    TileEntityBase.prototype.getScreenName = function (player, coords) {
        return "main";
    };
    TileEntityBase.prototype.getScreenByName = function (screenName) {
        return null;
    };
    /**
     * Called when player uses some item on a TileEntity. Replaces "click" function.
     * @returns true if should prevent opening UI.
    */
    TileEntityBase.prototype.onItemUse = function (coords, item, player) {
        return false;
    };
    /**
     * Prevents all actions on click
     */
    TileEntityBase.prototype.preventClick = function () {
        this._clickPrevented = true;
    };
    TileEntityBase.prototype.onItemClick = function (id, count, data, coords, player, extra) {
        if (!this.__initialized) {
            if (!this._runInit()) {
                return false;
            }
        }
        this._clickPrevented = false;
        if (this.onItemUse(coords, new ItemStack(id, count, data, extra), player) || this._clickPrevented) {
            return this._clickPrevented;
        }
        if (Entity.getSneaking(player)) {
            return false;
        }
        var screenName = this.getScreenName(player, coords);
        if (screenName) {
            var client = Network.getClientForPlayer(player);
            if (client) {
                this.container.openFor(client, screenName);
                return true;
            }
        }
        return false;
    };
    TileEntityBase.prototype.destroyBlock = function (coords, player) { };
    TileEntityBase.prototype.redstone = function (params) {
        this.onRedstoneUpdate(params.power);
    };
    /**
     * Occurs when redstone signal on TileEntity block was updated. Replaces "redstone" function
     * @param signal signal power (0-15)
     */
    TileEntityBase.prototype.onRedstoneUpdate = function (signal) { };
    TileEntityBase.prototype.projectileHit = function (coords, target) { };
    TileEntityBase.prototype.destroy = function () {
        return false;
    };
    TileEntityBase.prototype.selfDestroy = function () {
        TileEntity.destroyTileEntity(this);
    };
    TileEntityBase.prototype.requireMoreLiquid = function (liquid, amount) { };
    TileEntityBase.prototype.updateLiquidScale = function (scale, liquid) {
        this.container.sendEvent("setLiquidScale", { scale: scale, liquid: liquid, amount: this.liquidStorage.getRelativeAmount(liquid) });
    };
    TileEntityBase.prototype.setLiquidScale = function (container, window, content, data) {
        var gui = container.getUiAdapter();
        if (gui) {
            var size = gui.getBinding(data.scale, "element_rect");
            if (!size)
                return;
            var texture = LiquidRegistry.getLiquidUITexture(data.liquid, size.width(), size.height());
            gui.setBinding(data.scale, "texture", texture);
            gui.setBinding(data.scale, "value", data.amount);
        }
    };
    __decorate([
        BlockEngine.Decorators.ContainerEvent(Side.Client)
    ], TileEntityBase.prototype, "setLiquidScale", null);
    return TileEntityBase;
}());
/**
 * Registry for liquid storage items. Compatible with LiquidRegistry.
 */
var LiquidItemRegistry;
(function (LiquidItemRegistry) {
    LiquidItemRegistry.EmptyByFull = {};
    LiquidItemRegistry.FullByEmpty = {};
    /**
     * Registers liquid storage item
     * @param liquid liquid name
     * @param emptyId empty item id
     * @param fullId id of item with luquid
     * @param storage capacity of liquid in mB
     */
    function registerItem(liquid, emptyId, fullId, storage) {
        LiquidItemRegistry.EmptyByFull[fullId] = { id: emptyId, liquid: liquid, storage: storage };
        LiquidItemRegistry.FullByEmpty[emptyId + ":" + liquid] = { id: fullId, storage: storage };
        Item.setMaxDamage(fullId, storage);
        if (storage == 1000)
            LiquidRegistry.registerItem(liquid, { id: emptyId, data: 0 }, { id: fullId, data: 0 });
    }
    LiquidItemRegistry.registerItem = registerItem;
    function getItemLiquid(id, data) {
        var empty = LiquidItemRegistry.EmptyByFull[id];
        if (empty) {
            return empty.liquid;
        }
        return LiquidRegistry.getItemLiquid(id, data);
    }
    LiquidItemRegistry.getItemLiquid = getItemLiquid;
    function getEmptyItem(id, data) {
        var emptyData = LiquidItemRegistry.EmptyByFull[id];
        if (emptyData) {
            var amount = emptyData.storage - data;
            return { id: emptyData.id, data: 0, liquid: emptyData.liquid, amount: amount, storage: emptyData.storage };
        }
        var empty = LiquidRegistry.getEmptyItem(id, data);
        if (empty) {
            return { id: empty.id, data: empty.data, liquid: empty.liquid, amount: 1000 };
        }
        return null;
    }
    LiquidItemRegistry.getEmptyItem = getEmptyItem;
    function getFullItem(id, data, liquid) {
        var emptyData = LiquidItemRegistry.EmptyByFull[id];
        if (emptyData && data > 0) {
            return { id: id, data: 0, amount: data, storage: emptyData.storage };
        }
        var fullData = LiquidItemRegistry.FullByEmpty[id + ":" + liquid];
        if (fullData) {
            return { id: fullData.id, data: 0, amount: fullData.storage, storage: fullData.storage };
        }
        var full = LiquidRegistry.getFullItem(id, data, liquid);
        if (full) {
            return { id: full.id, data: full.data, amount: 1000 };
        }
        return null;
    }
    LiquidItemRegistry.getFullItem = getFullItem;
})(LiquidItemRegistry || (LiquidItemRegistry = {}));
var BlockEngine;
(function (BlockEngine) {
    var LiquidTank = /** @class */ (function () {
        function LiquidTank(tileEntity, name, limit, liquids) {
            this.name = name;
            this.limit = limit;
            if (liquids)
                this.setValidLiquids(liquids);
            this.setParent(tileEntity);
        }
        LiquidTank.prototype.setParent = function (tileEntity) {
            this.tileEntity = tileEntity;
            var liquidData = tileEntity.data[this.name] || {
                liquid: null,
                amount: 0
            };
            tileEntity.data[this.name] = this.data = liquidData;
        };
        LiquidTank.prototype.getLiquidStored = function () {
            return this.data.liquid;
        };
        LiquidTank.prototype.getLimit = function () {
            return this.limit;
        };
        LiquidTank.prototype.isValidLiquid = function (liquid) {
            if (!this.liquids) {
                return true;
            }
            return this.liquids[liquid] || false;
        };
        LiquidTank.prototype.setValidLiquids = function (liquids) {
            this.liquids = {};
            for (var _i = 0, liquids_1 = liquids; _i < liquids_1.length; _i++) {
                var name = liquids_1[_i];
                this.liquids[name] = true;
            }
        };
        LiquidTank.prototype.getAmount = function (liquid) {
            if (!liquid || this.data.liquid == liquid) {
                return this.data.amount;
            }
            return 0;
        };
        LiquidTank.prototype.setAmount = function (liquid, amount) {
            this.data.liquid = liquid;
            this.data.amount = amount;
        };
        LiquidTank.prototype.getRelativeAmount = function () {
            return this.data.amount / this.limit;
        };
        LiquidTank.prototype.addLiquid = function (liquid, amount) {
            if (!this.data.liquid || this.data.liquid == liquid) {
                this.data.liquid = liquid;
                var add = Math.min(amount, this.limit - this.data.amount);
                this.data.amount += add;
                return amount - add;
            }
            return 0;
        };
        LiquidTank.prototype.getLiquid = function (liquid, amount) {
            if (amount == undefined) {
                amount = liquid;
                liquid = null;
            }
            if (!liquid || this.data.liquid == liquid) {
                var got = Math.min(amount, this.data.amount);
                this.data.amount -= got;
                if (this.data.amount == 0) {
                    this.data.liquid = null;
                }
                return got;
            }
            return 0;
        };
        LiquidTank.prototype.isFull = function () {
            return this.data.amount >= this.limit;
        };
        LiquidTank.prototype.isEmpty = function () {
            return this.data.amount <= 0;
        };
        LiquidTank.prototype.addLiquidToItem = function (inputSlot, outputSlot) {
            var liquid = this.getLiquidStored();
            if (!liquid)
                return false;
            var amount = this.getAmount(liquid);
            if (amount > 0) {
                var full = LiquidItemRegistry.getFullItem(inputSlot.id, inputSlot.data, liquid);
                if (full && (outputSlot.id == full.id && outputSlot.data == full.data && outputSlot.count < Item.getMaxStack(full.id) || outputSlot.id == 0)) {
                    if (amount >= full.amount) {
                        this.getLiquid(full.amount);
                        inputSlot.setSlot(inputSlot.id, inputSlot.count - 1, inputSlot.data);
                        inputSlot.validate();
                        outputSlot.setSlot(full.id, outputSlot.count + 1, full.data);
                        return true;
                    }
                    if (inputSlot.count == 1 && full.storage) {
                        if (inputSlot.id == full.id) {
                            amount = this.getLiquid(full.amount);
                            inputSlot.setSlot(inputSlot.id, 1, inputSlot.data - amount);
                        }
                        else {
                            amount = this.getLiquid(full.storage);
                            inputSlot.setSlot(full.id, 1, full.storage - amount);
                        }
                        return true;
                    }
                }
            }
            return false;
        };
        LiquidTank.prototype.getLiquidFromItem = function (inputSlot, outputSlot) {
            var liquid = this.getLiquidStored();
            var empty = LiquidItemRegistry.getEmptyItem(inputSlot.id, inputSlot.data);
            if (empty && (!liquid && this.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !this.isFull()) {
                if (outputSlot.id == empty.id && outputSlot.data == empty.data && outputSlot.count < Item.getMaxStack(empty.id) || outputSlot.id == 0) {
                    var freeAmount = this.getLimit() - this.getAmount();
                    if (freeAmount >= empty.amount) {
                        this.addLiquid(empty.liquid, empty.amount);
                        inputSlot.setSlot(inputSlot.id, inputSlot.count - 1, inputSlot.data);
                        inputSlot.validate();
                        outputSlot.setSlot(empty.id, outputSlot.count + 1, empty.data);
                        return true;
                    }
                    if (inputSlot.count == 1 && empty.storage) {
                        var amount = Math.min(freeAmount, empty.amount);
                        this.addLiquid(empty.liquid, amount);
                        inputSlot.setSlot(inputSlot.id, 1, inputSlot.data + amount);
                        return true;
                    }
                }
            }
            return false;
        };
        LiquidTank.prototype.updateUiScale = function (scale) {
            var container = this.tileEntity.container;
            if (container.isLegacyContainer()) {
                this.tileEntity.liquidStorage._setContainerScale(container, scale, this.data.liquid, this.getRelativeAmount());
            }
            else {
                container.sendEvent("setLiquidScale", { scale: scale, liquid: this.data.liquid, amount: this.getRelativeAmount() });
            }
        };
        return LiquidTank;
    }());
    BlockEngine.LiquidTank = LiquidTank;
})(BlockEngine || (BlockEngine = {}));
// classes
EXPORT("ItemStack", ItemStack);
EXPORT("Vector3", Vector3);
EXPORT("WorldRegion", WorldRegion);
EXPORT("PlayerEntity", PlayerEntity);
EXPORT("TileEntityBase", TileEntityBase);
EXPORT("ItemCommon", ItemCommon);
EXPORT("ItemFood", ItemFood);
EXPORT("ItemThrowable", ItemThrowable);
EXPORT("ItemArmor", ItemArmor);
EXPORT("ItemTool", ItemTool);
EXPORT("ToolType", ToolType);
// enums
EXPORT("Side", Side);
EXPORT("ItemCategory", ItemCategory);
EXPORT("EnumRarity", EnumRarity);
EXPORT("MiningLevel", MiningLevel);
// APIs
EXPORT("BlockEngine", BlockEngine);
EXPORT("BlockModeler", BlockModeler);
EXPORT("BlockRegistry", BlockRegistry);
EXPORT("ItemRegistry", ItemRegistry);
EXPORT("LiquidItemRegistry", LiquidItemRegistry);
EXPORT("EntityCustomData", EntityCustomData);
EXPORT("IDConverter", IDConverter);
