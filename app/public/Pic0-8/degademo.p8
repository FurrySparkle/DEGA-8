pico-8 cartridge // http://www.pico-8.com
version 42
__lua__

-- mario clone in pico-8

-- define constants
gravity = 0.2
jump_force = -3
player_speed = 1.5
player_width = 8
player_height = 8

-- define player state
player = {
    x = 64,
    y = 64,
    dx = 0,
    dy = 0,
    on_ground = false
}

-- define enemy state
enemy = {
    x = 96,
    y = 64,
    dx = -0.5,
    width = 8,
    height = 8
}

-- initialize game
function _init()
    cls()
end

-- update game state
function _update()
    -- player movement
    if btn(0) then
        player.dx = -player_speed
    elseif btn(1) then
        player.dx = player_speed
    else
        player.dx = 0
    end

    -- player jump
    if player.on_ground and btnp(4) then
        player.dy = jump_force
        player.on_ground = false
    end

    -- apply gravity
    player.dy = player.dy + gravity

    -- update player position
    player.x = player.x + player.dx
    player.y = player.y + player.dy

    -- check ground collision
    if player.y > 120 then
        player.y = 120
        player.dy = 0
        player.on_ground = true
    end

    -- update enemy position
    enemy.x = enemy.x + enemy.dx

    -- enemy wrap around
    if enemy.x < 0 then
        enemy.x = 128
    end

    -- check collision with enemy
    if collide(player, enemy) then
        sfx(04) -- play damage sound
    end
end

-- draw game elements
function _draw()
    cls()
    -- draw player
    rectfill(player.x, player.y, player.x + player_width, player.y + player_height, 8)

    -- draw enemy
    rectfill(enemy.x, enemy.y, enemy.x + enemy.width, enemy.y + enemy.height, 8)

    -- draw ground
    rectfill(0, 128, 128, 128, 3)
end

-- collision detection function
function collide(a, b)
    return a.x < b.x + b.width and
           b.x < a.x + player_width and
           a.y < b.y + b.height and
           b.y < a.y + player_height
end

__gfx__
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
__label__
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddddddd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddddddd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddddd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddddddd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddddddd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddddd0000000000000ccccccccccccccccccccc00000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddddd00000000000000ccccccccccccccccccccc00000000000000000000000000000000000000000000000000000000000
0000000000000000ddddddddddddddddd000000000000000ccccccccccccccccccccc00000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddddd0000000000000000ccccccccccccccccccccc00000000000000000000000000000000000000000000000000000000000
0000000000000000dddddddddddddd000000000000000000ccccccccccccccccccccc00000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccc000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccc000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccc000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccc000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccc000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccccccc000000000000000ddddddddddddd0000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccccccc000000000000000ddddddddddddd0000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccccccc000000000000000ddddddddddddd0000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccccccc000000000000000ddddddddddddd0000000000000000000000000000000
000000000000000000000000000000000000000000000000ccccccccccccccccccccc00000000000ddddddddddddddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd0000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd0000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd0000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd000ddddddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd000ddddddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd000ddddddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddd0000000ddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddddddddddddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddddddddddddddd0000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddddddddddddddd000000000000000ccccccccccccc000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddddddddddddddd000000000000000ccccccccccccc000
00000000000000000000000000000000000000000000000000000000000000000000000000000000ddddddddddddddddd000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccccccccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ccccc000ccccc000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

__sfx__
0007000012110000001e140000301915000000121500f150111501515017150171501b15021150000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000100001d65018150166501d5501c650215501f55023550236502365000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000200000a35005150116501365014640196201e60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300000875018750077501d75007750227500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00040000196501f150166501c1500c150131500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300000000007150000001515000000061500000015150000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00030000072500d640072500a65006260056300320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

