using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using Assets.Scripts.Models.Towers;
using Assets.Scripts.Models.Towers.Behaviors.Emissions;
using Assets.Scripts.Models.TowerSets;
using BTD_Mod_Helper;
using BTD_Mod_Helper.Api.Towers;
using BTD_Mod_Helper.Extensions;
using MelonLoader;
using Assets.Main.Scenes;
using Assets.Scripts.Models;
using Assets.Scripts.Models.GenericBehaviors;
using Assets.Scripts.Models.Powers;
using Assets.Scripts.Models.Profile;
using Assets.Scripts.Models.Towers.Behaviors;
using Assets.Scripts.Models.Towers.Behaviors.Abilities;
using Assets.Scripts.Models.Towers.Behaviors.Abilities.Behaviors;
using Assets.Scripts.Models.Towers.Behaviors.Attack;
using Assets.Scripts.Models.Towers.Behaviors.Attack.Behaviors;
using Assets.Scripts.Models.Towers.Filters;
using Assets.Scripts.Models.Towers.Projectiles.Behaviors;
using Assets.Scripts.Models.Towers.Upgrades;
using Assets.Scripts.Unity;
using Assets.Scripts.Unity.Display;
using Assets.Scripts.Unity.UI_New.InGame;
using Assets.Scripts.Unity.UI_New.InGame.StoreMenu;
using Assets.Scripts.Unity.UI_New.Upgrade;
using Assets.Scripts.Utils;
using Harmony;
using Il2CppSystem.Collections.Generic;

namespace MathMonkeyMod {
    public static class Extensions {
        public static void Display(this TowerModel tower, string uuid) {
            tower.display = uuid;
            tower.GetBehavior<DisplayModel>().display = uuid;
        }

        public static float Range(this TowerModel tower) {
            return tower.range;
        }
        public static float Range(this TowerModel tower, float value) {
            tower.range = value;
            tower.GetAttackModel().range = value;
            return value;
        }

        public static float Pierce(this TowerModel tower) {
            return tower.GetAttackModel().weapons[0].projectile.pierce;
        }
        public static float Pierce(this TowerModel tower, int weapon) {
            return tower.GetAttackModel().weapons[weapon].projectile.pierce;
        }
        public static float Pierce(this TowerModel tower, float value) {
            return tower.GetAttackModel().weapons[0].projectile.pierce = value;
        }
        public static float Pierce(this TowerModel tower, float value, int weapon) {
            return tower.GetAttackModel().weapons[weapon].projectile.pierce = value;
        }

        public static float AttackRate(this TowerModel tower) {
            return tower.GetAttackModel().weapons[0].Rate;
        }
        public static float AttackRate(this TowerModel tower, int weapon) {
            return tower.GetAttackModel().weapons[weapon].Rate;
        }
        public static float AttackRate(this TowerModel tower, float value) {
            return tower.GetAttackModel().weapons[0].Rate = value;
        }
        public static float AttackRate(this TowerModel tower, float value, int weapon) {
            return tower.GetAttackModel().weapons[weapon].Rate = value;
        }
        
        public static float Damage(this TowerModel tower) {
            return tower.GetAttackModel().weapons[0].projectile.GetBehavior<DamageModel>().damage;
        }
        public static float Damage(this TowerModel tower, int weapon) {
            return tower.GetAttackModel().weapons[weapon].projectile.GetBehavior<DamageModel>().damage;
        }
        public static float Damage(this TowerModel tower, float value) {
            return tower.GetAttackModel().weapons[0].projectile.GetBehavior<DamageModel>().damage = value;
        }
        public static float Damage(this TowerModel tower, float value, int weapon) {
            return tower.GetAttackModel().weapons[weapon].projectile.GetBehavior<DamageModel>().damage = value;
        }

        public static bool IgnoreLineOfSight(this TowerModel tower) {
            return tower.GetAttackModel().attackThroughWalls;
        }
        public static bool IgnoreLineOfSight(this TowerModel tower, bool value) {
            tower.GetAttackModel().attackThroughWalls = value;
            tower.ignoreBlockers = value;
            foreach (var weapon in tower.GetAttackModel().weapons) {
                weapon.projectile.ignoreBlockers = value;
                weapon.projectile.canCollisionBeBlockedByMapLos = value;
            }
            return value;
        }
    }
}
