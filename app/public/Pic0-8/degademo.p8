pico-8 cartridge // http://www.pico-8.com
version 42
__lua__
-- dega large vertical bouncing animation
-- pico-8 version

function _init()
    -- initialize position, velocity, and color
    dega = {
        letters = {
            {char="d", x=16, y=16, dy=1, color=13}, -- purple
            {char="e", x=48, y=32, dy=1, color=12}, -- teal
            {char="g", x=80, y=48, dy=1, color=13}, -- purple
            {char="a", x=112, y=64, dy=1, color=12}  -- teal
        }
    }
end

function _update()
    -- update vertical positions and bounce
    for letter in all(dega.letters) do
        letter.y += letter.dy

        -- bounce off top and bottom
        if letter.y < 0 or letter.y > 104 then
            letter.dy = -letter.dy
        end
    end
end

function _draw()
    cls()

    -- draw each letter
    for letter in all(dega.letters) do
        draw_letter(letter)
    end
end

function draw_letter(letter)
    local x, y, c = letter.x, letter.y, letter.color

    if letter.char == "d" then
        rectfill(x, y, x+10, y+20, c)
        circfill(x+10, y+10, 10, c)
    elseif letter.char == "e" then
       // rectfill(x, y, x+10, y+20, c)
        rectfill(x, y, x+20, y+4, c)
        rectfill(x, y+8, x+16, y+12, c)
        rectfill(x, y+16, x+20, y+20, c)
    elseif letter.char == "g" then
        rectfill(x+4, y, x+16, y+4, c)
        rectfill(x, y+4, x+4, y+16, c)
        rectfill(x+4, y+12, x+16, y+16, c)
        rectfill(x+12, y+8, x+16, y+12, c)
        rectfill(x+8, y+8, x+12, y+10, c)
    elseif letter.char == "a" then
        rectfill(x, y+2, x+4, y+18, c) -- left bar
        rectfill(x+8, y+2, x+12, y+18, c) -- right bar
        rectfill(x, y+8, x+12, y+12, c) -- crossbar
          rectfill(x, y+1, x+12, y-2, c) -- crossbar top

    end
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