-- Stats From Heracles421 on the Stormworks discord
-- Stats From Bones       on the Stormworks discord

-- Note:
--   Larger caliber projectiles receive proportionally less force from the wind

require("LifeBoatAPILocal.Utils.LBCopy")

---@section LBWeapons LBWEAPONSCLASS
LifeBoatAPI.LBWeapons = {
    ---@section LBWeapon_SmallArms
    LBWeapons_smallArms = {
        DragCoefficient   = 0;      -- technically "Unknown"
        MuzzleVelocity    = 800;    -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 300;    -- ticks
        DespawnsInAir     = true;
        ApproxMaxRange    = 500;    -- meters till despawn
    };
    ---@endsection

    ---@section LBWeapon_lightAutoCannon
    LBWeapons_LightAutoCannon = {
        DragCoefficient   = 0.02;      -- technically "Unknown"
        MuzzleVelocity    = 1000;    -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 300;    -- ticks
        DespawnsInAir     = true;
        ApproxMaxRange    = 750;    -- meters till despawn
    };
    ---@endsetion

    ---@section LBWeapon_rotaryAutoCannon
    LBWeapons_RotaryAutoCannon = {
        DragCoefficient   = 0.01;   -- technically "Unknown"
        MuzzleVelocity    = 1000;   -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 300;    -- ticks
        DespawnsInAir     = true;
        ApproxMaxRange    = 1500;   -- meters till despawn
    };
    ---@endsection

    ---@section LBWeapon_heavyAutoCannon
    LBWeapons_HeavyAutoCannon = {
        DragCoefficient   = 0.005;      -- technically "Unknown"
        MuzzleVelocity    = 900;    -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 600;    -- ticks
        DespawnsInAir     = true;
        ApproxMaxRange    = 2500;   -- meters till despawn
    };
    ---@endsection

    ---@section LBWeapon_battleCannon
    LBWeapons_BattleCannon = {
        DragCoefficient   = 0.002;      -- technically "Unknown"
        MuzzleVelocity    = 800;    -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 3600;   -- ticks
        DespawnsInAir     = false;
        ApproxMaxRange    = 4500;   -- meters indirect range at 45*
    };
    ---@endsection

    ---@section LBWeapon_artillery
    LBWeapons_Artillery = {
        DragCoefficient   = 0.001;      -- technically "Unknown"
        MuzzleVelocity    = 700;    -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 3600;    -- ticks
        DespawnsInAir     = false;
        ApproxMaxRange    = 6500;   -- meters indirect range at 45*
    };
    ---@endsection

    ---@section LBWeapon_bigBertha
    LBWeapons_BigBertha = {
        DragCoefficient   = 0.0005;      -- technically "Unknown"
        MuzzleVelocity    = 600;    -- m/s
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 3600;    -- ticks
        DespawnsInAir     = false;
        ApproxMaxRange    = 7500;   -- meters indirect range at 45*
    };
    ---@endsection

    ---@section LBWeapon_rocketLauncher
    LBWeapons_RocketLauncher = {
        DragCoefficient   = 0.003;  -- technically "Unknown"
        MuzzleVelocity    = 0;      -- non-ballistic weapon, accelerates at an unknown rate
        Gravity           = 30;     -- m/s
        DespawnBelowSpeed = 50;     -- m/s
        DespawnTicks      = 3600;   -- ticks
        DespawnsInAir     = false;
        ApproxMaxRange    = 2500;   -- meters indirect range at 45*
    };
    ---@endsection
}
---@endsection LBWEAPONSCLASS