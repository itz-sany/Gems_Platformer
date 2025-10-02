// Crystal Quest: The Lost Kingdom - Enhanced Platformer with Story
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'dialogue', 'gameOver', 'victory'
        this.currentLevel = 1;
        this.maxLevel = 6;
        this.crystals = 0;
        this.totalCrystals = 0;
        this.levelCompleted = false;
        
        // Level names
        this.levelNames = [
            '', // 0 index unused
            'The Forgotten Gardens',
            'The Ancient Ruins',
            'The Crystal Caverns',
            'The Floating Citadel',
            'The Shadow Realm',
            'The Final Sanctum'
        ];
        
        // Camera system
        this.camera = { x: 0, y: 0 };
        
        // Game objects
        this.player = null;
        this.platforms = [];
        this.enemies = [];
        this.crystalGems = [];
        this.npcs = [];
        this.particles = [];
        this.items = [];
        this.bosses = [];
        this.portals = [];
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Story and dialogue
        this.dialogueSystem = new DialogueSystem();
        this.storyProgress = 0;
        
        // Initialize UI
        this.initializeUI();
        
        // Physics
        this.gravity = 800;
        
        // Start game loop
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Interaction key
            if (e.code === 'KeyE' && this.gameState === 'playing') {
                this.checkInteractions();
            }
            
            // Magic casting
            if (e.code === 'KeyQ' && this.gameState === 'playing') {
                if (this.player) {
                    this.player.castMagic();
                }
            }
            
            // Dash ability
            if (e.code === 'ShiftLeft' && this.gameState === 'playing') {
                if (this.player) {
                    this.player.dash();
                }
            }
            
            // Jump keys - use jump buffer for more reliable jumping
            if ((e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') && this.gameState === 'playing') {
                e.preventDefault();
                if (this.player) {
                    // Try immediate jump first
                    if (!this.player.jump()) {
                        // If immediate jump fails, buffer it
                        this.player.jumpBuffer = 150; // 150ms buffer window
                    }
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('dialogueContinue').addEventListener('click', () => {
            this.dialogueSystem.continue();
        });
    }
    
    initializeUI() {
        this.crystalsElement = document.getElementById('crystals');
        this.healthFillElement = document.getElementById('healthFill');
        this.manaFillElement = document.getElementById('manaFill');
        this.currentLevelElement = document.getElementById('currentLevel');
        this.levelNameElement = document.getElementById('levelName');
        this.finalCrystalsElement = document.getElementById('finalCrystals');
        this.totalCrystalsElement = document.getElementById('totalCrystals');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOver');
        this.victoryScreen = document.getElementById('victoryScreen');
        
        // Ability status elements
        this.doubleJumpStatusElement = document.getElementById('doubleJumpStatus');
        this.wallJumpStatusElement = document.getElementById('wallJumpStatus');
        this.dashStatusElement = document.getElementById('dashStatus');
    }
    
    startGame() {
        this.gameState = 'playing';
        this.currentLevel = 1;
        this.crystals = 0;
        this.totalCrystals = 0;
        this.storyProgress = 0;
        this.levelCompleted = false;
        
        // Initialize player
        this.player = new Player(100, 400, this);
        
        // Load first level
        this.loadLevel(1);
        
        // Hide start screen
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.victoryScreen.classList.add('hidden');
        
        // Show opening dialogue
        setTimeout(() => {
            this.showDialogue('Aria', 'The Shadow Lord Malachar has corrupted the six realms... I must gather the crystals and restore the light to each realm. My journey begins in the Forgotten Gardens.');
        }, 1000);
        
        this.updateUI();
    }
    
    restartGame() {
        this.startGame();
    }
    
    loadLevel(levelNum) {
        this.platforms = [];
        this.enemies = [];
        this.crystalGems = [];
        this.npcs = [];
        this.particles = [];
        this.items = [];
        this.bosses = [];
        this.portals = [];
        this.levelCompleted = false; // Reset level completion flag
        
        // Load level-specific content
        switch(levelNum) {
            case 1: this.loadLevel1(); break;
            case 2: this.loadLevel2(); break;
            case 3: this.loadLevel3(); break;
            case 4: this.loadLevel4(); break;
            case 5: this.loadLevel5(); break;
            case 6: this.loadLevel6(); break;
        }
        
        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        
        // Reset player position
        if (this.player) {
            this.player.x = 100;
            this.player.y = 400;
            this.player.vx = 0;
            this.player.vy = 0;
        }
    }
    
    loadLevel1() {
        // Level 1: The Forgotten Gardens - Tutorial level
        // Ground platforms
        this.platforms.push(new Platform(0, 550, 400, 50, '#8B4513'));
        this.platforms.push(new Platform(500, 550, 300, 50, '#8B4513'));
        this.platforms.push(new Platform(900, 550, 400, 50, '#8B4513'));
        
        // Floating platforms
        this.platforms.push(new Platform(300, 450, 100, 20, '#654321'));
        this.platforms.push(new Platform(600, 400, 120, 20, '#654321'));
        this.platforms.push(new Platform(800, 350, 100, 20, '#654321'));
        this.platforms.push(new Platform(1000, 300, 150, 20, '#654321'));
        
        // Crystals
        this.crystalGems.push(new Crystal(350, 400, 'blue'));
        this.crystalGems.push(new Crystal(650, 350, 'red'));
        this.crystalGems.push(new Crystal(850, 300, 'green'));
        this.crystalGems.push(new Crystal(1100, 250, 'purple'));
        
        // Items - Health Potion
        this.items.push(new Item(450, 500, 'health_potion'));
        
        // Enemies
        this.enemies.push(new Enemy(550, 500, 'goblin', this));
        this.enemies.push(new Enemy(950, 500, 'goblin', this));
        
        // NPCs
        this.npcs.push(new NPC(200, 500, 'sage', 'Elder Thorne', this));
        
        // Portal at the end of the level
        this.portals.push(new Portal(1200, 470, this));
    }
    
    loadLevel2() {
        // Level 2: The Ancient Ruins - Introduces double jump
        this.platforms.push(new Platform(0, 550, 200, 50, '#8B4513'));
        this.platforms.push(new Platform(300, 500, 150, 20, '#654321'));
        this.platforms.push(new Platform(500, 450, 100, 20, '#654321'));
        this.platforms.push(new Platform(650, 400, 120, 20, '#654321'));
        this.platforms.push(new Platform(800, 350, 100, 20, '#654321'));
        this.platforms.push(new Platform(950, 300, 150, 20, '#654321'));
        this.platforms.push(new Platform(1150, 250, 200, 20, '#654321'));
        this.platforms.push(new Platform(1400, 550, 300, 50, '#8B4513'));
        
        // Crystals
        this.crystalGems.push(new Crystal(350, 450, 'blue'));
        this.crystalGems.push(new Crystal(550, 400, 'red'));
        this.crystalGems.push(new Crystal(700, 350, 'green'));
        this.crystalGems.push(new Crystal(1000, 250, 'purple'));
        this.crystalGems.push(new Crystal(1200, 200, 'gold'));
        
        // Items - Double Jump Boots
        this.items.push(new Item(1250, 200, 'double_jump_boots'));
        this.items.push(new Item(600, 350, 'mana_potion'));
        
        // Enemies
        this.enemies.push(new Enemy(350, 450, 'goblin', this));
        this.enemies.push(new Enemy(700, 300, 'orc', this));
        this.enemies.push(new Enemy(1200, 200, 'goblin', this));
        
        // NPC
        this.npcs.push(new NPC(1500, 500, 'knight', 'Sir Gareth', this));
        
        // Portal at the end of the level
        this.portals.push(new Portal(1600, 470, this));
    }
    
    loadLevel3() {
        // Level 3: The Crystal Caverns - Underground level with wall jumping (REBALANCED)
        this.platforms.push(new Platform(0, 550, 200, 50, '#4A4A4A'));
        this.platforms.push(new Platform(180, 480, 100, 20, '#696969'));
        this.platforms.push(new Platform(300, 420, 100, 20, '#696969'));
        this.platforms.push(new Platform(420, 360, 100, 20, '#696969'));
        
        // More accessible intermediate platforms
        this.platforms.push(new Platform(540, 300, 80, 20, '#696969'));
        
        // Walls for wall jumping (better positioned)
        this.platforms.push(new Platform(640, 200, 20, 200, '#2F4F4F')); // Wall
        this.platforms.push(new Platform(760, 150, 20, 250, '#2F4F4F')); // Wall
        
        // More platforms for easier progression
        this.platforms.push(new Platform(680, 250, 80, 20, '#696969'));
        this.platforms.push(new Platform(800, 300, 120, 20, '#696969'));
        this.platforms.push(new Platform(940, 250, 120, 20, '#696969'));
        this.platforms.push(new Platform(1080, 200, 150, 20, '#696969'));
        this.platforms.push(new Platform(1250, 550, 250, 50, '#4A4A4A'));
        
        // Crystals (repositioned for accessibility)
        this.crystalGems.push(new Crystal(230, 430, 'blue'));
        this.crystalGems.push(new Crystal(350, 370, 'red'));
        this.crystalGems.push(new Crystal(470, 310, 'green'));
        this.crystalGems.push(new Crystal(570, 250, 'purple'));
        this.crystalGems.push(new Crystal(850, 250, 'gold'));
        this.crystalGems.push(new Crystal(1130, 150, 'diamond'));
        
        // Items - Wall Jump Gloves (more accessible position)
        this.items.push(new Item(350, 370, 'wall_jump_gloves'));
        this.items.push(new Item(470, 310, 'health_potion'));
        
        // Enemies (reduced and repositioned)
        this.enemies.push(new Enemy(250, 430, 'cave_spider', this));
        this.enemies.push(new Enemy(850, 250, 'cave_spider', this));
        
        // NPC
        this.npcs.push(new NPC(1350, 500, 'miner', 'Dwarf Borin', this));
        
        // Portal at the end of the level
        this.portals.push(new Portal(1450, 470, this));
    }
    
    loadLevel4() {
        // Level 4: The Floating Citadel - Sky level with dash mechanics
        this.platforms.push(new Platform(0, 550, 120, 50, '#B0C4DE'));
        this.platforms.push(new Platform(200, 450, 80, 20, '#87CEEB'));
        this.platforms.push(new Platform(350, 380, 80, 20, '#87CEEB'));
        this.platforms.push(new Platform(500, 320, 80, 20, '#87CEEB'));
        this.platforms.push(new Platform(680, 260, 80, 20, '#87CEEB'));
        this.platforms.push(new Platform(850, 200, 100, 20, '#87CEEB'));
        this.platforms.push(new Platform(1050, 150, 120, 20, '#87CEEB'));
        this.platforms.push(new Platform(1250, 100, 150, 20, '#87CEEB'));
        this.platforms.push(new Platform(1450, 200, 200, 50, '#B0C4DE'));
        
        // Crystals
        this.crystalGems.push(new Crystal(240, 400, 'blue'));
        this.crystalGems.push(new Crystal(390, 330, 'red'));
        this.crystalGems.push(new Crystal(540, 270, 'green'));
        this.crystalGems.push(new Crystal(720, 210, 'purple'));
        this.crystalGems.push(new Crystal(890, 150, 'gold'));
        this.crystalGems.push(new Crystal(1110, 100, 'diamond'));
        this.crystalGems.push(new Crystal(1320, 50, 'rainbow'));
        
        // Items - Dash Boots
        this.items.push(new Item(1350, 50, 'dash_boots'));
        this.items.push(new Item(600, 220, 'mana_potion'));
        this.items.push(new Item(1000, 100, 'health_potion'));
        
        // Flying enemies
        this.enemies.push(new Enemy(300, 350, 'wind_spirit', this));
        this.enemies.push(new Enemy(600, 250, 'wind_spirit', this));
        this.enemies.push(new Enemy(900, 150, 'sky_guardian', this));
        this.enemies.push(new Enemy(1200, 80, 'sky_guardian', this));
        
        // NPC
        this.npcs.push(new NPC(1550, 150, 'sky_mage', 'Aerion the Wind Walker', this));
        
        // Portal at the end of the level
        this.portals.push(new Portal(1650, 120, this));
    }
    
    loadLevel5() {
        // Level 5: The Shadow Realm - Dark level with challenging enemies
        this.platforms.push(new Platform(0, 550, 150, 50, '#2F2F2F'));
        this.platforms.push(new Platform(200, 480, 100, 20, '#1C1C1C'));
        this.platforms.push(new Platform(350, 420, 80, 20, '#1C1C1C'));
        this.platforms.push(new Platform(480, 360, 100, 20, '#1C1C1C'));
        this.platforms.push(new Platform(630, 300, 80, 20, '#1C1C1C'));
        this.platforms.push(new Platform(760, 240, 100, 20, '#1C1C1C'));
        this.platforms.push(new Platform(910, 180, 120, 20, '#1C1C1C'));
        this.platforms.push(new Platform(1080, 120, 150, 20, '#1C1C1C'));
        this.platforms.push(new Platform(1280, 200, 100, 20, '#1C1C1C'));
        this.platforms.push(new Platform(1430, 350, 200, 50, '#2F2F2F'));
        
        // Crystals
        this.crystalGems.push(new Crystal(250, 430, 'shadow'));
        this.crystalGems.push(new Crystal(390, 370, 'shadow'));
        this.crystalGems.push(new Crystal(530, 310, 'shadow'));
        this.crystalGems.push(new Crystal(680, 250, 'shadow'));
        this.crystalGems.push(new Crystal(810, 190, 'shadow'));
        this.crystalGems.push(new Crystal(960, 130, 'shadow'));
        this.crystalGems.push(new Crystal(1150, 70, 'void'));
        this.crystalGems.push(new Crystal(1530, 300, 'void'));
        
        // Items
        this.items.push(new Item(400, 370, 'shadow_resistance'));
        this.items.push(new Item(700, 200, 'mana_potion'));
        this.items.push(new Item(1200, 70, 'health_potion'));
        
        // Shadow enemies
        this.enemies.push(new Enemy(300, 430, 'shadow_wraith', this));
        this.enemies.push(new Enemy(550, 310, 'shadow_wraith', this));
        this.enemies.push(new Enemy(800, 190, 'shadow_beast', this));
        this.enemies.push(new Enemy(1000, 130, 'shadow_beast', this));
        this.enemies.push(new Enemy(1350, 300, 'void_stalker', this));
        
        // NPC
        this.npcs.push(new NPC(1500, 300, 'shadow_sage', 'Umbra the Keeper', this));
        
        // Portal at the end of the level
        this.portals.push(new Portal(1600, 270, this));
    }
    
    loadLevel6() {
        // Level 6: The Final Sanctum - Boss level
        this.platforms.push(new Platform(0, 550, 200, 50, '#FFD700'));
        this.platforms.push(new Platform(300, 500, 150, 20, '#FFA500'));
        this.platforms.push(new Platform(500, 450, 150, 20, '#FFA500'));
        this.platforms.push(new Platform(700, 400, 150, 20, '#FFA500'));
        this.platforms.push(new Platform(900, 350, 150, 20, '#FFA500'));
        this.platforms.push(new Platform(1100, 300, 200, 20, '#FFA500'));
        this.platforms.push(new Platform(1350, 250, 150, 20, '#FFA500'));
        this.platforms.push(new Platform(1550, 200, 200, 50, '#FFD700'));
        
        // Final crystals
        this.crystalGems.push(new Crystal(350, 450, 'master'));
        this.crystalGems.push(new Crystal(550, 400, 'master'));
        this.crystalGems.push(new Crystal(750, 350, 'master'));
        this.crystalGems.push(new Crystal(950, 300, 'master'));
        this.crystalGems.push(new Crystal(1150, 250, 'master'));
        this.crystalGems.push(new Crystal(1400, 200, 'ultimate'));
        this.crystalGems.push(new Crystal(1650, 150, 'ultimate'));
        
        // Final items
        this.items.push(new Item(600, 400, 'ultimate_power'));
        this.items.push(new Item(1000, 250, 'full_restore'));
        
        // Boss enemy
        this.bosses.push(new Boss(1200, 100, 'shadow_lord', this));
        
        // Final NPC
        this.npcs.push(new NPC(1650, 150, 'princess', 'Princess Luna', this));
        
        // Victory Portal (final level)
        this.portals.push(new Portal(1750, 120, this));
    }
    
    checkInteractions() {
        // Check NPC interactions
        this.npcs.forEach(npc => {
            if (this.isNear(this.player, npc, 60)) {
                npc.interact();
            }
        });
        
        // Check portal interactions
        this.portals.forEach(portal => {
            if (this.isNear(this.player, portal, 50)) {
                portal.interact();
            }
        });
        
        // Check item interactions
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (this.isNear(this.player, item, 40)) {
                this.player.collectItem(item);
                this.createSparkles(item.x, item.y, '#FFD700');
                this.items.splice(i, 1);
            }
        }
    }
    
    isNear(obj1, obj2, distance) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy) < distance;
    }
    
    showDialogue(character, text) {
        this.dialogueSystem.show(character, text);
        this.gameState = 'dialogue';
    }
    
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel > this.maxLevel) {
            this.victory();
        } else {
            this.loadLevel(this.currentLevel);
            const levelName = this.levelNames[this.currentLevel];
            this.showDialogue('Aria', `Entering ${levelName}... The crystal energy grows stronger, but so does the darkness.`);
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.finalCrystalsElement.textContent = this.totalCrystals;
        this.gameOverScreen.classList.remove('hidden');
    }
    
    victory() {
        this.gameState = 'victory';
        this.totalCrystalsElement.textContent = this.totalCrystals;
        this.victoryScreen.classList.remove('hidden');
        this.showDialogue('Princess Luna', 'Aria! You have defeated the Shadow Lord and restored all six realms! The Crystal Kingdom shines with eternal light once more!');
    }
    
    updateUI() {
        this.crystalsElement.textContent = this.crystals;
        this.currentLevelElement.textContent = this.currentLevel;
        this.levelNameElement.textContent = this.levelNames[this.currentLevel] || '';
        
        if (this.player) {
            const healthPercent = (this.player.health / this.player.maxHealth) * 100;
            this.healthFillElement.style.width = healthPercent + '%';
            
            const manaPercent = (this.player.mana / this.player.maxMana) * 100;
            this.manaFillElement.style.width = manaPercent + '%';
            
            // Update ability status
            this.doubleJumpStatusElement.textContent = this.player.hasDoubleJump ? 'Unlocked' : 'Locked';
            this.wallJumpStatusElement.textContent = this.player.hasWallJump ? 'Unlocked' : 'Locked';
            this.dashStatusElement.textContent = this.player.hasDash ? 'Unlocked' : 'Locked';
        }
    }
    
    updateCamera() {
        if (!this.player) return;
        
        // Follow player with some offset
        const targetX = this.player.x - this.width / 2;
        const targetY = this.player.y - this.height / 2;
        
        // Smooth camera movement
        this.camera.x += (targetX - this.camera.x) * 0.1;
        this.camera.y += (targetY - this.camera.y) * 0.1;
        
        // Keep camera in bounds
        this.camera.x = Math.max(0, this.camera.x);
        this.camera.y = Math.max(-200, Math.min(0, this.camera.y));
    }
    
    update(deltaTime) {
        if (this.gameState === 'dialogue') {
            this.dialogueSystem.update();
            if (!this.dialogueSystem.isActive) {
                this.gameState = 'playing';
            }
            return;
        }
        
        if (this.gameState !== 'playing') return;
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
            
            if (this.player.health <= 0) {
                this.gameOver();
                return;
            }
            
            // Check if player fell off the world
            if (this.player.y > this.height + 100) {
                this.player.takeDamage(25);
                this.player.x = 100;
                this.player.y = 400;
                this.player.vx = 0;
                this.player.vy = 0;
            }
        }
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        
        // Update bosses
        this.bosses.forEach(boss => boss.update(deltaTime));
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Update crystals (animation)
        this.crystalGems.forEach(crystal => crystal.update(deltaTime));
        
        // Update items (animation)
        this.items.forEach(item => item.update(deltaTime));
        
        // Update portals
        this.portals.forEach(portal => portal.update(deltaTime));
        
        // Check collisions
        this.checkCollisions();
        
        // Process jump buffer after collision detection
        if (this.player) {
            // Update coyote time
            if (this.player.onGround) {
                this.player.coyoteTime = 100; // 100ms coyote time
            }
            
            // Process buffered jump
            if (this.player.jumpBuffer > 0 && (this.player.onGround || this.player.coyoteTime > 0)) {
                this.player.jump();
                this.player.jumpBuffer = 0;
            }
        }
        
        // Update camera
        this.updateCamera();
        
        // Update portal activation status based on crystal collection
        this.portals.forEach(portal => {
            portal.updateActivation(this.crystalGems.length === 0 && this.bosses.every(boss => boss.defeated));
        });
        
        this.updateUI();
    }
    
    checkCollisions() {
        if (!this.player) return;
        
        // Reset player collision states at the start of collision detection
        this.player.onGround = false;
        this.player.onWall = false;
        
        // Platform collisions (improved)
        this.platforms.forEach(platform => {
            if (this.isColliding(this.player, platform)) {
                const playerCenterX = this.player.x + this.player.width / 2;
                const playerCenterY = this.player.y + this.player.height / 2;
                const platformCenterX = platform.x + platform.width / 2;
                const platformCenterY = platform.y + platform.height / 2;
                
                const overlapX = Math.min(this.player.x + this.player.width - platform.x, platform.x + platform.width - this.player.x);
                const overlapY = Math.min(this.player.y + this.player.height - platform.y, platform.y + platform.height - this.player.y);
                
                // Determine collision direction based on smallest overlap
                if (overlapX < overlapY) {
                    // Horizontal collision (side)
                    if (playerCenterX < platformCenterX) {
                        // Hit from left
                        this.player.x = platform.x - this.player.width;
                        this.player.vx = 0;
                        this.player.onWall = true;
                        this.player.wallDirection = 1;
                    } else {
                        // Hit from right
                        this.player.x = platform.x + platform.width;
                        this.player.vx = 0;
                        this.player.onWall = true;
                        this.player.wallDirection = -1;
                    }
                } else {
                    // Vertical collision (top/bottom)
                    if (playerCenterY < platformCenterY) {
                        // Landing on top
                        this.player.y = platform.y - this.player.height;
                        this.player.vy = 0;
                        this.player.onGround = true;
                        this.player.canDoubleJump = true;
                    } else {
                        // Hit from below
                        this.player.y = platform.y + platform.height;
                        this.player.vy = 0;
                    }
                }
            }
        });
        
        // Crystal collisions
        for (let i = this.crystalGems.length - 1; i >= 0; i--) {
            const crystal = this.crystalGems[i];
            if (this.isColliding(this.player, crystal)) {
                this.crystals++;
                this.totalCrystals++;
                this.createSparkles(crystal.x, crystal.y, crystal.color);
                this.crystalGems.splice(i, 1);
                
                // Restore some mana when collecting crystals
                this.player.mana = Math.min(this.player.maxMana, this.player.mana + 20);
            }
        }
        
        // Enemy collisions
        this.enemies.forEach(enemy => {
            if (this.isColliding(this.player, enemy)) {
                this.player.takeDamage(enemy.damage || 20);
                // Knockback
                const dx = this.player.x - enemy.x;
                this.player.vx = dx > 0 ? 200 : -200;
                this.player.vy = -300;
            }
        });
        
        // Boss collisions
        this.bosses.forEach(boss => {
            if (this.isColliding(this.player, boss) && !boss.defeated) {
                this.player.takeDamage(boss.damage || 30);
                // Knockback
                const dx = this.player.x - boss.x;
                this.player.vx = dx > 0 ? 300 : -300;
                this.player.vy = -400;
            }
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    createSparkles(x, y, color) {
        for (let i = 0; i < 12; i++) {
            this.particles.push(new Particle(x, y, color, 'sparkle'));
        }
    }
    
    render() {
        // Clear canvas with gradient background based on level
        let gradient;
        if (this.currentLevel <= 2) {
            // Garden/Ruins - Day sky
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(0.7, '#98FB98');
            gradient.addColorStop(1, '#8B4513');
        } else if (this.currentLevel === 3) {
            // Caverns - Underground
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#2F2F2F');
            gradient.addColorStop(0.5, '#4A4A4A');
            gradient.addColorStop(1, '#1C1C1C');
        } else if (this.currentLevel === 4) {
            // Citadel - Sky
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#E6E6FA');
            gradient.addColorStop(0.5, '#B0C4DE');
            gradient.addColorStop(1, '#87CEEB');
        } else if (this.currentLevel === 5) {
            // Shadow Realm - Dark
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#191970');
            gradient.addColorStop(0.5, '#2F2F2F');
            gradient.addColorStop(1, '#000000');
        } else {
            // Final Sanctum - Golden
            gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF8C00');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw environment effects
        this.drawEnvironmentEffects();
        
        if (this.gameState === 'playing' || this.gameState === 'dialogue') {
            this.ctx.save();
            this.ctx.translate(-this.camera.x, -this.camera.y);
            
            // Render platforms
            this.platforms.forEach(platform => platform.render(this.ctx));
            
            // Render items
            this.items.forEach(item => item.render(this.ctx));
            
            // Render crystals
            this.crystalGems.forEach(crystal => crystal.render(this.ctx));
            
            // Render enemies
            this.enemies.forEach(enemy => enemy.render(this.ctx));
            
            // Render bosses
            this.bosses.forEach(boss => boss.render(this.ctx));
            
            // Render NPCs
            this.npcs.forEach(npc => npc.render(this.ctx));
            
            // Render portals
            this.portals.forEach(portal => portal.render(this.ctx));
            
            // Render player
            if (this.player) {
                this.player.render(this.ctx);
            }
            
            // Render particles
            this.particles.forEach(particle => particle.render(this.ctx));
            
            this.ctx.restore();
        }
    }
    
    drawEnvironmentEffects() {
        if (this.currentLevel <= 2) {
            // Draw clouds for garden/ruins
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 5; i++) {
                const x = (i * 200 + Date.now() * 0.01) % (this.width + 100);
                const y = 50 + i * 30;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 30, 0, Math.PI * 2);
                this.ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
                this.ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
                this.ctx.fill();
            }
        } else if (this.currentLevel === 5) {
            // Draw shadow effects
            this.ctx.fillStyle = 'rgba(75, 0, 130, 0.3)';
            for (let i = 0; i < 20; i++) {
                const x = (i * 50 + Date.now() * 0.02) % (this.width + 50);
                const y = (i * 30 + Date.now() * 0.01) % this.height;
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = Math.min(currentTime - (this.lastTime || 0), 16.67); // Cap at 60fps
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Enhanced Player Class with new abilities
class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.vx = 0;
        this.vy = 0;
        this.speed = 250;
        this.jumpPower = 450;
        this.health = 100;
        this.maxHealth = 100;
        this.mana = 100;
        this.maxMana = 100;
        this.game = game;
        this.onGround = false;
        this.onWall = false;
        this.wallDirection = 0;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.animationFrame = 0;
        this.animationTime = 0;
        this.facing = 1; // 1 for right, -1 for left
        
        // New abilities
        this.hasDoubleJump = false;
        this.canDoubleJump = false;
        this.hasWallJump = false;
        this.hasDash = false;
        this.dashCooldown = 0;
        this.dashDistance = 200;
        this.isDashing = false;
        this.dashTime = 0;
        
        // Magic abilities
        this.magicCooldown = 0;
        
        // Jump buffering for more responsive controls
        this.jumpBuffer = 0;
        this.coyoteTime = 0;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        // Handle movement
        let moving = false;
        if (this.game.keys['KeyA'] || this.game.keys['ArrowLeft']) {
            if (!this.isDashing) {
                this.vx = -this.speed;
                this.facing = -1;
                moving = true;
            }
        } else if (this.game.keys['KeyD'] || this.game.keys['ArrowRight']) {
            if (!this.isDashing) {
                this.vx = this.speed;
                this.facing = 1;
                moving = true;
            }
        } else {
            if (!this.isDashing) {
                this.vx *= 0.8; // Friction
            }
        }
        
        // Handle dashing
        if (this.isDashing) {
            this.dashTime -= deltaTime;
            if (this.dashTime <= 0) {
                this.isDashing = false;
                this.vx *= 0.5; // Slow down after dash
            }
        }
        
        // Apply gravity
        if (!this.onGround && !this.isDashing) {
            this.vy += this.game.gravity * dt;
        }
        
        // Wall sliding
        if (this.onWall && !this.onGround && this.vy > 0) {
            this.vy = Math.min(this.vy, 100); // Slow fall on walls
        }
        
        // Update position
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Update cooldowns
        if (this.invulnerable) {
            this.invulnerabilityTime -= deltaTime;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }
        
        if (this.magicCooldown > 0) {
            this.magicCooldown -= deltaTime;
        }
        
        // Handle jump buffering and coyote time
        if (this.jumpBuffer > 0) {
            this.jumpBuffer -= deltaTime;
        }
        
        if (this.coyoteTime > 0) {
            this.coyoteTime -= deltaTime;
        }
        
        // Update coyote time when on ground (will be set in collision detection)
        // Note: This is handled after collision detection now
        
        // Regenerate mana slowly
        if (this.mana < this.maxMana) {
            this.mana = Math.min(this.maxMana, this.mana + 10 * dt);
        }
        
        // Update animation
        if (moving) {
            this.animationTime += deltaTime;
            if (this.animationTime > 200) {
                this.animationFrame = (this.animationFrame + 1) % 4;
                this.animationTime = 0;
            }
        } else {
            this.animationFrame = 0;
        }
    }
    
    jump() {
        // Ground jump (including coyote time)
        if (this.onGround || this.coyoteTime > 0) {
            this.vy = -this.jumpPower;
            this.onGround = false;
            this.coyoteTime = 0; // Use up coyote time
            this.canDoubleJump = this.hasDoubleJump;
            return true;
        } 
        // Double jump
        else if (this.hasDoubleJump && this.canDoubleJump) {
            this.vy = -this.jumpPower * 0.8;
            this.canDoubleJump = false;
            this.createJumpEffect();
            return true;
        } 
        // Wall jump
        else if (this.hasWallJump && this.onWall) {
            this.vy = -this.jumpPower * 0.9;
            this.vx = this.wallDirection * this.speed * 1.5;
            this.onWall = false;
            this.createJumpEffect();
            return true;
        }
        return false;
    }
    
    dash() {
        if (this.hasDash && this.dashCooldown <= 0 && !this.isDashing) {
            this.isDashing = true;
            this.dashTime = 200; // 200ms dash
            this.dashCooldown = 1000; // 1 second cooldown
            this.vx = this.facing * this.dashDistance * 5; // Fast dash speed
            this.vy = 0; // Stop vertical movement during dash
            this.createDashEffect();
        }
    }
    
    castMagic() {
        if (this.magicCooldown <= 0 && this.mana >= 30) {
            this.mana -= 30;
            this.magicCooldown = 800;
            
            // Create magic projectile
            this.game.particles.push(new MagicProjectile(
                this.x + this.width/2,
                this.y + this.height/2,
                this.facing,
                this.game
            ));
            
            this.createMagicEffect();
        }
    }
    
    collectItem(item) {
        switch(item.type) {
            case 'health_potion':
                this.health = Math.min(this.maxHealth, this.health + 50);
                break;
            case 'mana_potion':
                this.mana = Math.min(this.maxMana, this.mana + 50);
                break;
            case 'double_jump_boots':
                this.hasDoubleJump = true;
                this.game.showDialogue('Aria', 'I found the Boots of Air Walking! Now I can jump twice in the air!');
                break;
            case 'wall_jump_gloves':
                this.hasWallJump = true;
                this.game.showDialogue('Aria', 'The Gloves of Wall Climbing! I can now jump off walls!');
                break;
            case 'dash_boots':
                this.hasDash = true;
                this.game.showDialogue('Aria', 'The Boots of Swift Movement! I can now dash through the air!');
                break;
            case 'shadow_resistance':
                this.maxHealth += 25;
                this.health += 25;
                break;
            case 'ultimate_power':
                this.maxMana += 50;
                this.mana = this.maxMana;
                break;
            case 'full_restore':
                this.health = this.maxHealth;
                this.mana = this.maxMana;
                break;
        }
    }
    
    takeDamage(damage) {
        if (!this.invulnerable) {
            this.health -= damage;
            this.health = Math.max(0, this.health);
            this.invulnerable = true;
            this.invulnerabilityTime = 1000; // 1 second of invulnerability
        }
    }
    
    createJumpEffect() {
        for (let i = 0; i < 6; i++) {
            this.game.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height,
                '#87CEEB',
                'jump'
            ));
        }
    }
    
    createDashEffect() {
        for (let i = 0; i < 8; i++) {
            this.game.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height/2,
                '#FFD700',
                'dash'
            ));
        }
    }
    
    createMagicEffect() {
        for (let i = 0; i < 5; i++) {
            this.game.particles.push(new Particle(
                this.x + this.width/2,
                this.y + this.height/2,
                '#8A2BE2',
                'magic'
            ));
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Flicker when invulnerable
        if (this.invulnerable && Math.floor(Date.now() / 100) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Dash effect
        if (this.isDashing) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
        }
        
        // Draw player (Aria - the enhanced guardian)
        ctx.fillStyle = '#DDA0DD'; // Plum color for robes
        ctx.fillRect(this.x, this.y + 20, this.width, this.height - 20);
        
        // Head
        ctx.fillStyle = '#FDBCB4'; // Skin color
        ctx.fillRect(this.x + 8, this.y, 16, 20);
        
        // Hair
        ctx.fillStyle = '#8B4513'; // Brown hair
        ctx.fillRect(this.x + 6, this.y, 20, 12);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 10, this.y + 6, 2, 2);
        ctx.fillRect(this.x + 20, this.y + 6, 2, 2);
        
        // Magic aura (stronger with more abilities)
        const auraIntensity = (this.hasDoubleJump ? 1 : 0) + (this.hasWallJump ? 1 : 0) + (this.hasDash ? 1 : 0);
        ctx.strokeStyle = auraIntensity > 0 ? '#8A2BE2' : '#FFD700';
        ctx.lineWidth = 2 + auraIntensity;
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2 + 5 + auraIntensity * 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // Ability indicators
        if (this.hasDoubleJump) {
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(this.x + 2, this.y + 2, 4, 4);
        }
        if (this.hasWallJump) {
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(this.x + this.width - 6, this.y + 2, 4, 4);
        }
        if (this.hasDash) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x + this.width/2 - 2, this.y + 2, 4, 4);
        }
        
        ctx.restore();
    }
}

// Enhanced Platform Class
class Platform {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add some texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = 0; i < this.width; i += 20) {
            ctx.fillRect(this.x + i, this.y, 1, this.height);
        }
        
        // Add highlight on top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(this.x, this.y, this.width, 2);
    }
}

// Enhanced Crystal Class with new types
class Crystal {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.type = type;
        this.animationTime = 0;
        this.bobOffset = 0;
        
        // Set color based on type
        const colors = {
            'blue': '#0080FF',
            'red': '#FF4444',
            'green': '#44FF44',
            'purple': '#8844FF',
            'gold': '#FFD700',
            'diamond': '#FFFFFF',
            'rainbow': '#FF00FF',
            'shadow': '#4B0082',
            'void': '#191970',
            'master': '#FFD700',
            'ultimate': '#FF1493'
        };
        this.color = colors[type] || '#FFFFFF';
    }
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        this.bobOffset = Math.sin(this.animationTime * 0.005) * 5;
    }
    
    render(ctx) {
        const renderY = this.y + this.bobOffset;
        
        // Enhanced glow effect for special crystals
        if (this.type === 'ultimate' || this.type === 'master') {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 25;
        } else {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 15;
        }
        
        // Crystal shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, renderY);
        ctx.lineTo(this.x + this.width, renderY + this.height/2);
        ctx.lineTo(this.x + this.width/2, renderY + this.height);
        ctx.lineTo(this.x, renderY + this.height/2);
        ctx.closePath();
        ctx.fill();
        
        // Inner shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, renderY + 4);
        ctx.lineTo(this.x + this.width - 4, renderY + this.height/2);
        ctx.lineTo(this.x + this.width/2, renderY + this.height - 4);
        ctx.lineTo(this.x + 4, renderY + this.height/2);
        ctx.closePath();
        ctx.fill();
        
        // Special effects for rare crystals
        if (this.type === 'rainbow') {
            const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
            const colorIndex = Math.floor(this.animationTime / 200) % colors.length;
            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(this.x + 8, renderY + 8, 8, 8);
        }
        
        ctx.shadowBlur = 0;
    }
}

// New Item Class
class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.type = type;
        this.animationTime = 0;
        this.bobOffset = 0;
        
        // Set appearance based on type
        const appearances = {
            'health_potion': { color: '#FF0000', symbol: '+' },
            'mana_potion': { color: '#0000FF', symbol: 'M' },
            'double_jump_boots': { color: '#87CEEB', symbol: '↑↑' },
            'wall_jump_gloves': { color: '#32CD32', symbol: '⟷' },
            'dash_boots': { color: '#FFD700', symbol: '→' },
            'shadow_resistance': { color: '#4B0082', symbol: '◊' },
            'ultimate_power': { color: '#FF1493', symbol: '★' },
            'full_restore': { color: '#00FF00', symbol: '♥' }
        };
        
        this.appearance = appearances[type] || { color: '#FFFFFF', symbol: '?' };
    }
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        this.bobOffset = Math.sin(this.animationTime * 0.003) * 3;
    }
    
    render(ctx) {
        const renderY = this.y + this.bobOffset;
        
        // Glow effect
        ctx.shadowColor = this.appearance.color;
        ctx.shadowBlur = 10;
        
        // Item background
        ctx.fillStyle = this.appearance.color;
        ctx.fillRect(this.x, renderY, this.width, this.height);
        
        // Item border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, renderY, this.width, this.height);
        
        // Item symbol
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.appearance.symbol, this.x + this.width/2, renderY + this.height/2 + 6);
        
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
    }
}

// Enhanced Enemy Class with new types
class Enemy {
    constructor(x, y, type, game) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.game = game;
        this.vx = 0;
        this.vy = 0;
        this.direction = 1;
        this.patrolDistance = 100;
        this.startX = x;
        this.animationTime = 0;
        this.health = 1;
        this.damage = 20;
        
        // Set properties based on type
        switch(type) {
            case 'goblin':
                this.width = 28;
                this.height = 32;
                this.speed = 50;
                this.color = '#228B22';
                break;
            case 'orc':
                this.width = 36;
                this.height = 40;
                this.speed = 30;
                this.color = '#8B0000';
                this.health = 2;
                this.damage = 25;
                break;
            case 'cave_spider':
                this.width = 24;
                this.height = 24;
                this.speed = 80;
                this.color = '#800080';
                break;
            case 'wind_spirit':
                this.width = 32;
                this.height = 32;
                this.speed = 60;
                this.color = '#87CEEB';
                this.flying = true;
                break;
            case 'sky_guardian':
                this.width = 40;
                this.height = 36;
                this.speed = 40;
                this.color = '#4169E1';
                this.flying = true;
                this.health = 3;
                this.damage = 30;
                break;
            case 'shadow_wraith':
                this.width = 30;
                this.height = 36;
                this.speed = 70;
                this.color = '#4B0082';
                this.damage = 25;
                break;
            case 'shadow_beast':
                this.width = 44;
                this.height = 40;
                this.speed = 45;
                this.color = '#2F2F2F';
                this.health = 3;
                this.damage = 35;
                break;
            case 'void_stalker':
                this.width = 38;
                this.height = 42;
                this.speed = 55;
                this.color = '#191970';
                this.health = 4;
                this.damage = 40;
                break;
        }
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        if (this.flying) {
            // Flying movement pattern
            this.vx = this.speed * this.direction;
            this.vy = Math.sin(this.animationTime * 0.003) * 30;
        } else {
            // Ground movement
            this.vx = this.speed * this.direction;
        }
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Turn around at patrol limits
        if (Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
        }
        
        this.animationTime += deltaTime;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            // Remove enemy and create death effect
            const index = this.game.enemies.indexOf(this);
            if (index > -1) {
                this.game.enemies.splice(index, 1);
                this.game.createSparkles(this.x, this.y, '#FF4444');
            }
        }
    }
    
    render(ctx) {
        // Enemy body with enhanced visuals
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 4, this.y + 4, 4, 4);
        ctx.fillRect(this.x + this.width - 8, this.y + 4, 4, 4);
        
        // Special effects based on type
        if (this.type.includes('shadow')) {
            ctx.shadowColor = '#4B0082';
            ctx.shadowBlur = 10;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.shadowBlur = 0;
        }
        
        if (this.flying) {
            // Wings or floating effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(this.x - 4, this.y + 8, 8, 16);
            ctx.fillRect(this.x + this.width - 4, this.y + 8, 8, 16);
        }
        
        // Health indicator for stronger enemies
        if (this.health > 1) {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(this.x, this.y - 8, this.width, 4);
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(this.x, this.y - 8, (this.width * this.health) / (this.type === 'orc' ? 2 : this.type === 'sky_guardian' ? 3 : 4), 4);
        }
    }
}

// New Boss Class
class Boss {
    constructor(x, y, type, game) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.game = game;
        this.width = 80;
        this.height = 100;
        this.health = 10;
        this.maxHealth = 10;
        this.damage = 50;
        this.speed = 30;
        this.vx = 0;
        this.vy = 0;
        this.direction = 1;
        this.attackCooldown = 0;
        this.defeated = false;
        this.animationTime = 0;
        
        if (type === 'shadow_lord') {
            this.color = '#000000';
            this.auraColor = '#8B0000';
        }
    }
    
    update(deltaTime) {
        if (this.defeated) return;
        
        const dt = deltaTime / 1000;
        
        // Boss AI - move toward player
        if (this.game.player) {
            const dx = this.game.player.x - this.x;
            if (Math.abs(dx) > 100) {
                this.vx = dx > 0 ? this.speed : -this.speed;
            } else {
                this.vx = 0;
            }
        }
        
        this.x += this.vx * dt;
        
        // Attack pattern
        this.attackCooldown -= deltaTime;
        if (this.attackCooldown <= 0) {
            this.attack();
            this.attackCooldown = 2000; // Attack every 2 seconds
        }
        
        this.animationTime += deltaTime;
    }
    
    attack() {
        // Create shadow projectiles
        for (let i = 0; i < 3; i++) {
            this.game.particles.push(new EnemyProjectile(
                this.x + this.width/2,
                this.y + this.height/2,
                (i - 1) * 0.5, // Spread shots
                this.game
            ));
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.defeated = true;
            this.game.createSparkles(this.x, this.y, '#FFD700');
            this.game.showDialogue('Shadow Lord Malachar', 'Impossible... the light... it burns... The Crystal Kingdom... is... restored...');
        }
    }
    
    render(ctx) {
        if (this.defeated) return;
        
        // Boss aura
        ctx.shadowColor = this.auraColor;
        ctx.shadowBlur = 20;
        
        // Boss body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Boss details
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
        
        // Eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x + 15, this.y + 15, 8, 8);
        ctx.fillRect(this.x + this.width - 23, this.y + 15, 8, 8);
        
        // Health bar
        const barWidth = this.width;
        const barHeight = 8;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.x, this.y - 15, barWidth, barHeight);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x, this.y - 15, barWidth * healthPercent, barHeight);
        
        // Boss name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Shadow Lord Malachar', this.x + this.width/2, this.y - 20);
        ctx.textAlign = 'left';
    }
}

// Enhanced NPC Class with more characters
class NPC {
    constructor(x, y, type, name, game) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.type = type;
        this.name = name;
        this.game = game;
        this.hasInteracted = false;
        this.dialogues = this.getDialogues();
        this.currentDialogue = 0;
    }
    
    getDialogues() {
        const dialogues = {
            'sage': [
                'Welcome, Crystal Guardian! The realms have been corrupted by shadow magic. You must gather the crystals to restore the light!',
                'Each realm holds unique challenges. Master new abilities to overcome them!',
                'The Shadow Lord grows stronger with each passing moment. Hurry!'
            ],
            'knight': [
                'Greetings, Guardian! I see you\'ve mastered the art of double jumping. Well done!',
                'The ruins ahead are treacherous. Watch for crumbling platforms!',
                'May the light guide your path!'
            ],
            'miner': [
                'Ah, a surface dweller! These caverns are filled with ancient magic.',
                'The walls here respond to those with the gift. Try jumping off them!',
                'Beware the cave spiders - they\'re more dangerous than they look!'
            ],
            'sky_mage': [
                'Welcome to the Floating Citadel, Guardian of Crystals!',
                'The winds here can carry you far if you learn to dash through them.',
                'The sky guardians test all who would claim the celestial crystals!'
            ],
            'shadow_sage': [
                'You have entered the Shadow Realm, where darkness reigns supreme.',
                'Only those pure of heart can resist the shadow\'s corruption.',
                'The Shadow Lord awaits in his sanctum. Prepare yourself!'
            ],
            'princess': [
                'Aria! You\'ve done it! The six realms are cleansed!',
                'With all the crystals gathered, we can finally banish the Shadow Lord forever!',
                'The Crystal Kingdom owes you a debt that can never be repaid!'
            ]
        };
        
        return dialogues[this.type] || ['Hello, traveler!'];
    }
    
    interact() {
        if (this.currentDialogue < this.dialogues.length) {
            this.game.showDialogue(this.name, this.dialogues[this.currentDialogue]);
            this.currentDialogue++;
        } else {
            this.game.showDialogue(this.name, this.dialogues[this.dialogues.length - 1]);
        }
    }
    
    render(ctx) {
        // Enhanced NPC rendering based on type
        switch(this.type) {
            case 'sage':
                // Sage robes
                ctx.fillStyle = '#4B0082';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                
                // Head
                ctx.fillStyle = '#FDBCB4';
                ctx.fillRect(this.x + 8, this.y, 16, 16);
                
                // Wizard hat
                ctx.fillStyle = '#4B0082';
                ctx.beginPath();
                ctx.moveTo(this.x + 16, this.y - 8);
                ctx.lineTo(this.x + 8, this.y + 8);
                ctx.lineTo(this.x + 24, this.y + 8);
                ctx.closePath();
                ctx.fill();
                
                // Staff
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 28, this.y, 4, this.height);
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(this.x + 30, this.y - 4, 6, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'knight':
                // Knight armor
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                
                // Head
                ctx.fillStyle = '#FDBCB4';
                ctx.fillRect(this.x + 8, this.y + 4, 16, 12);
                
                // Helmet
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(this.x + 6, this.y, 20, 8);
                
                // Sword
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(this.x + 30, this.y + 8, 4, 24);
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 28, this.y + 32, 8, 8);
                break;
                
            case 'miner':
                // Miner clothes
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                
                // Head
                ctx.fillStyle = '#FDBCB4';
                ctx.fillRect(this.x + 8, this.y, 16, 16);
                
                // Mining helmet
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(this.x + 6, this.y, 20, 6);
                
                // Pickaxe
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(this.x + 28, this.y + 8, 4, 20);
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(this.x + 26, this.y + 6, 8, 4);
                break;
                
            case 'sky_mage':
                // Sky robes
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                
                // Head
                ctx.fillStyle = '#FDBCB4';
                ctx.fillRect(this.x + 8, this.y, 16, 16);
                
                // Floating crystals around mage
                for (let i = 0; i < 3; i++) {
                    const angle = (Date.now() * 0.003 + i * Math.PI * 2 / 3);
                    const orbX = this.x + 16 + Math.cos(angle) * 20;
                    const orbY = this.y + 24 + Math.sin(angle) * 10;
                    ctx.fillStyle = '#4169E1';
                    ctx.beginPath();
                    ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'shadow_sage':
                // Shadow robes
                ctx.fillStyle = '#2F2F2F';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                
                // Head (partially shadowed)
                ctx.fillStyle = '#FDBCB4';
                ctx.fillRect(this.x + 8, this.y, 16, 16);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(this.x + 8, this.y, 8, 16);
                
                // Shadow aura
                ctx.shadowColor = '#4B0082';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#2F2F2F';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                ctx.shadowBlur = 0;
                break;
                
            case 'princess':
                // Princess dress
                ctx.fillStyle = '#FFB6C1';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                
                // Head
                ctx.fillStyle = '#FDBCB4';
                ctx.fillRect(this.x + 8, this.y, 16, 16);
                
                // Crown
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(this.x + 6, this.y - 4, 20, 6);
                
                // Hair
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(this.x + 4, this.y + 2, 24, 14);
                
                // Royal aura
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
                ctx.fillStyle = '#FFB6C1';
                ctx.fillRect(this.x, this.y + 16, this.width, this.height - 16);
                ctx.shadowBlur = 0;
                break;
        }
        
        // Interaction indicator
        if (this.game.isNear(this.game.player, this, 60)) {
            ctx.fillStyle = '#FFD700';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Press E to talk', this.x + this.width/2, this.y - 10);
            ctx.textAlign = 'left';
        }
    }
}

// Enhanced Particle Class with new types
class Particle {
    constructor(x, y, color, type = 'default') {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 200;
        this.vy = (Math.random() - 0.5) * 200;
        this.life = 1000;
        this.maxLife = 1000;
        this.color = color;
        this.size = Math.random() * 6 + 2;
        this.type = type;
        
        // Adjust properties based on type
        switch(type) {
            case 'jump':
                this.vy = Math.random() * -100 - 50;
                this.vx = (Math.random() - 0.5) * 100;
                this.life = 500;
                this.maxLife = 500;
                break;
            case 'dash':
                this.vx = (Math.random() - 0.5) * 300;
                this.vy = (Math.random() - 0.5) * 100;
                this.life = 300;
                this.maxLife = 300;
                break;
            case 'magic':
                this.vx = (Math.random() - 0.5) * 150;
                this.vy = (Math.random() - 0.5) * 150;
                this.life = 800;
                this.maxLife = 800;
                break;
        }
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= deltaTime;
        
        if (this.type === 'sparkle') {
            this.vy -= 100 * dt; // Float upward
            this.vx *= 0.98;
        } else if (this.type === 'jump') {
            this.vy += 200 * dt; // Gravity
            this.vx *= 0.95;
        } else if (this.type === 'dash') {
            this.vx *= 0.9;
            this.vy *= 0.9;
        } else if (this.type === 'magic') {
            this.vx *= 0.98;
            this.vy *= 0.98;
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        
        if (this.type === 'sparkle' || this.type === 'magic') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Sparkle effect
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.x - this.size, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.stroke();
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        
        ctx.globalAlpha = 1;
    }
}

// New Magic Projectile Class
class MagicProjectile extends Particle {
    constructor(x, y, direction, game) {
        super(x, y, '#8A2BE2', 'magic');
        this.vx = direction * 400;
        this.vy = 0;
        this.game = game;
        this.damage = 3;
        this.life = 2000;
        this.maxLife = 2000;
        this.size = 8;
        this.width = 16;  // Collision box width
        this.height = 16; // Collision box height
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Check collision with enemies
        for (let i = this.game.enemies.length - 1; i >= 0; i--) {
            const enemy = this.game.enemies[i];
            if (this.game.isColliding(this, enemy)) {
                enemy.takeDamage(this.damage);
                this.life = 0; // Destroy projectile
                break;
            }
        }
        
        // Check collision with bosses
        this.game.bosses.forEach(boss => {
            if (this.game.isColliding(this, boss) && !boss.defeated) {
                boss.takeDamage(this.damage);
                this.life = 0;
            }
        });
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        
        // Magic projectile with trail effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// New Enemy Projectile Class
class EnemyProjectile extends Particle {
    constructor(x, y, angle, game) {
        super(x, y, '#8B0000', 'enemy_magic');
        this.vx = Math.cos(angle) * 200;
        this.vy = Math.sin(angle) * 200;
        this.game = game;
        this.damage = 25;
        this.life = 3000;
        this.maxLife = 3000;
        this.size = 6;
        this.width = 12;  // Collision box width
        this.height = 12; // Collision box height
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Check collision with player
        if (this.game.player && this.game.isColliding(this, this.game.player)) {
            this.game.player.takeDamage(this.damage);
            this.life = 0; // Destroy projectile
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        
        // Enemy projectile
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
}

// Portal Class for level progression
class Portal {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;
        this.game = game;
        this.isActive = false;
        this.animationTime = 0;
        this.glowIntensity = 0;
    }
    
    updateActivation(canActivate) {
        this.isActive = canActivate;
    }
    
    interact() {
        if (this.isActive) {
            // Portal is active - proceed to next level or victory
            if (!this.game.levelCompleted) {
                this.game.levelCompleted = true;
                if (this.game.currentLevel >= this.game.maxLevel) {
                    // Final level - trigger victory
                    this.game.showDialogue('Portal', 'The final portal blazes with restored light... The Crystal Kingdom is saved!');
                    setTimeout(() => {
                        this.game.victory();
                    }, 2000);
                } else {
                    // Regular level progression
                    this.game.showDialogue('Portal', 'The way forward opens... Stepping into the next realm!');
                    setTimeout(() => {
                        this.game.nextLevel();
                    }, 1500);
                }
            }
        } else {
            // Portal is inactive - show missing crystals message
            const missingCrystals = this.game.crystalGems.length;
            const bosses = this.game.bosses.filter(boss => !boss.defeated);
            let message = '';
            
            if (missingCrystals > 0 && bosses.length > 0) {
                message = `The portal remains sealed... You need ${missingCrystals} more crystal${missingCrystals > 1 ? 's' : ''} and must defeat ${bosses.length} more enem${bosses.length > 1 ? 'ies' : 'y'}!`;
            } else if (missingCrystals > 0) {
                message = `The portal remains sealed... You need ${missingCrystals} more crystal${missingCrystals > 1 ? 's' : ''}!`;
            } else if (bosses.length > 0) {
                message = `The portal remains sealed... You must defeat ${bosses.length} more enem${bosses.length > 1 ? 'ies' : 'y'}!`;
            }
            
            this.game.showDialogue('Portal', message);
        }
    }
    
    update(deltaTime) {
        this.animationTime += deltaTime;
        
        if (this.isActive) {
            this.glowIntensity = Math.sin(this.animationTime * 0.005) * 0.5 + 0.5;
        } else {
            this.glowIntensity = Math.sin(this.animationTime * 0.002) * 0.2 + 0.3;
        }
    }
    
    render(ctx) {
        // Portal base
        const gradient = ctx.createRadialGradient(
            this.x + this.width/2, this.y + this.height/2, 0,
            this.x + this.width/2, this.y + this.height/2, this.width/2
        );
        
        if (this.isActive) {
            // Active portal - bright and inviting
            gradient.addColorStop(0, `rgba(255, 215, 0, ${this.glowIntensity})`);
            gradient.addColorStop(0.5, `rgba(138, 43, 226, ${this.glowIntensity * 0.8})`);
            gradient.addColorStop(1, `rgba(75, 0, 130, ${this.glowIntensity * 0.6})`);
            
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
        } else {
            // Inactive portal - dim and sealed
            gradient.addColorStop(0, `rgba(100, 100, 100, ${this.glowIntensity})`);
            gradient.addColorStop(0.5, `rgba(50, 50, 50, ${this.glowIntensity * 0.8})`);
            gradient.addColorStop(1, `rgba(25, 25, 25, ${this.glowIntensity * 0.6})`);
            
            ctx.shadowColor = '#666666';
            ctx.shadowBlur = 10;
        }
        
        // Draw portal oval
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Portal frame
        ctx.strokeStyle = this.isActive ? '#FFD700' : '#444444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Swirling energy effect
        if (this.isActive) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.glowIntensity * 0.6})`;
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const angle = (this.animationTime * 0.003) + (i * Math.PI * 2 / 3);
                const radius = (this.width/2 - 10) * (0.3 + i * 0.2);
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/2, radius, angle, angle + Math.PI);
                ctx.stroke();
            }
        }
        
        ctx.shadowBlur = 0;
        
        // Interaction prompt
        if (this.game.isNear(this.game.player, this, 60)) {
            ctx.fillStyle = this.isActive ? '#FFD700' : '#CCCCCC';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            const text = this.isActive ? 'Press E to enter portal' : 'Portal sealed - collect all crystals';
            ctx.fillText(text, this.x + this.width/2, this.y - 10);
            ctx.textAlign = 'left';
        }
    }
}

// Enhanced Dialogue System Class
class DialogueSystem {
    constructor() {
        this.isActive = false;
        this.currentDialogue = null;
        this.dialogueBox = document.getElementById('dialogueBox');
        this.characterElement = document.getElementById('dialogueCharacter');
        this.textElement = document.getElementById('dialogueText');
        this.continueButton = document.getElementById('dialogueContinue');
    }
    
    show(character, text) {
        this.isActive = true;
        this.currentDialogue = { character, text };
        
        this.characterElement.textContent = character + ':';
        this.textElement.textContent = text;
        this.dialogueBox.classList.remove('hidden');
    }
    
    continue() {
        this.hide();
    }
    
    hide() {
        this.isActive = false;
        this.currentDialogue = null;
        this.dialogueBox.classList.add('hidden');
    }
    
    update() {
        // Handle dialogue system updates if needed
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});