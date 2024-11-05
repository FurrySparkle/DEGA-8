pico-8 cartridge // http://www.pico-8.com
version 42
__lua__
-- ant farm simulation with detailed mechanics

-- constants
local num_ants = 10
local sand_color = 9
local tunnel_color = 0
local ant_color = 1
local screen_size = 128

-- ant data structure
local ants = {}

-- initialize the nest position
local nest_x = 64
local nest_y = 64

-- function to create ants
function create_ants()
    for i = 1, num_ants do
        local ant = {
            x = nest_x,
            y = nest_y,
            dx = 0,
            dy = 0
        }
        add(ants, ant)
    end
end

-- function to fill the screen with sand
function fill_sand()
    for x = 0, screen_size - 1 do
        for y = 0, screen_size - 1 do
            pset(x, y, sand_color)
        end
    end
end

-- function to update ants' positions and digging behavior
function update_ants()
    for ant in all(ants) do
        -- determine random movement
        ant.dx = flr(rnd(3)) - 1
        ant.dy = flr(rnd(3)) - 1

        -- calculate new position
        local new_x = mid(0, ant.x + ant.dx, screen_size - 1)
        local new_y = mid(0, ant.y + ant.dy, screen_size - 1)

        -- check if sand is present at the new position
        if pget(new_x, new_y) == sand_color then
            -- dig sand and create a tunnel
            pset(new_x, new_y, tunnel_color)
        end

        -- update ant position
        ant.x = new_x
        ant.y = new_y
    end
end

-- function to draw ants on the screen
function draw_ants()
    -- draw each ant
    for ant in all(ants) do
        pset(ant.x, ant.y, ant_color)
    end
end

-- function to reset the simulation
function reset_simulation()
    cls() -- clear the screen
    fill_sand() -- refill the screen with sand
    create_ants() -- recreate the ants
end

-- main game loop
function _init()
    reset_simulation() -- initialize the simulation
end

function _update()
    update_ants() -- update ants' positions and behavior
end

function _draw()
    draw_ants() -- draw ants on the screen
end

-- function to handle input
function handle_input()
    if btnp(4) then -- check if the 'o' button is pressed
        reset_simulation() -- reset the simulation
    end
end

-- enhanced main loop with input handling
function _update60()
    handle_input() -- handle user input
    update_ants() -- update ants' positions and behavior
end

-- additional functions for more complexity

-- function to simulate ant communication
function communicate_ants()
    for ant in all(ants) do
        -- simple communication logic
        -- ants move towards the nest if close to each other
        if dist(ant.x, ant.y, nest_x, nest_y) < 10 then
            ant.dx = sgn(nest_x - ant.x)
            ant.dy = sgn(nest_y - ant.y)
        end
    end
end

-- utility function to calculate distance
function dist(x1, y1, x2, y2)
    return sqrt((x2 - x1)^2 + (y2 - y1)^2)
end

-- utility function to get the sign of a number
function sgn(x)
    return (x > 0) and 1 or (x < 0) and -1 or 0
end
__gfx__
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00077000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00700700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
