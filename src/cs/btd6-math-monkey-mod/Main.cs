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
using HarmonyLib;
using Il2CppSystem.Collections.Generic;
using Assets.Scripts.Simulation.Towers.Weapons;
using UnityEngine;

[assembly: MelonInfo(typeof(MathMonkeyMod.Main), "Math Monkey", "1.0.0", "WooperIsBest")]
[assembly: MelonGame("Ninja Kiwi", "BloonsTD6")]
namespace MathMonkeyMod
{
    public class Main : BloonsTD6Mod {

        public override void OnMainMenu() {
            base.OnMainMenu();
        }

        public override void OnApplicationStart() {
            base.OnApplicationStart();
            MelonLogger.Msg("Math Monkey Mod Loaded!");
        }

        /*public override void OnRoundStart() {
            base.OnRoundStart();
            if (!(InGame.instance != null && InGame.instance.bridge != null)) return;
            foreach (var tower in InGame.Bridge.GetAllTowers()) {
                if (tower.namedMonkeyKey == "MathMonkeyMod-MathMonkey1") {
                    try { // for some reason, when upgraded to tier 5, tower.GetUpgrade() causes an error
                        var tier = tower.tower.GetUpgrade(0).tier; // using this try-catch isn't super elegant but it works
                    } catch(NullReferenceException e) {
                        Console.WriteLine("5xx Math Monkey found!");
                        var damageModifier = new Assets.Scripts.Models.Towers.Projectiles.DamageModifierModel("DmgMod");
                        var mutator = new Assets.Scripts.Simulation.Objects.BehaviorMutator("E");
                        //var mutator = new Assets.Scripts.Simulation.Objects.BehaviorMutator("Mutator", true, 0, false);
                        tower.tower.AddMutator(mutator);
                        //var damageIncreaseModel = new Assets.Scripts.Models.Towers.Mods.DamageIncreaseModModel("AlgebraicAvatarDamageModel");
                    }

                    try {
                        var tier = tower.tower.GetUpgrade(2).tier;
                    } catch (NullReferenceException e) {
                        Console.WriteLine("xx5 Math Monkey found!");
                    }
                }
            }
        }*/

        public class MathMonkeyTower {
            public class MathMonkey : ModTower {
                public override string TowerSet => PRIMARY;

                public override string BaseTower => "EngineerMonkey-010";
                public override int Cost => 530;

                public override int TopPathUpgrades => 5;
                public override int MiddlePathUpgrades => 5;
                public override int BottomPathUpgrades => 5;
                public override string Description => "Uses advanced calculations to always hit its target.";
                public override string Icon => "MathMonkey-Portrait";

                public override void ModifyBaseTowerModel(TowerModel towerModel) {
                    towerModel.GetAttackModel().weapons[0].projectile.ApplyDisplay<Resources.Projectiles.PencilDisplay>();
                    towerModel.Range(40);

                    var weapon1 = Game.instance.model.GetTowerFromId("MonkeySub").Duplicate().GetAttackModel().weapons[0];
                    towerModel.GetAttackModel().weapons[0] = weapon1;
                    towerModel.Pierce(2.0f, 0);
                    towerModel.Damage(1.0f, 0);
                }

                //Path 1
                public class Plus : ModUpgrade<MathMonkey> {
                    public override int Path => TOP;
                    public override int Tier => 1;
                    public override int Cost => 500;
                    public override string DisplayName => "Plus";
                    public override string Description => "Shots do 1 extra damage.";
                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.Damage(tower.Damage() + 1);
                    }
                }

                public class Minus : ModUpgrade<MathMonkey> {
                    public override int Path => TOP;
                    public override int Tier => 2;
                    public override int Cost => 800;
                    public override string DisplayName => "Minus";
                    public override string Description => "Takes -0.5 seconds to shoot.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.AttackRate(tower.AttackRate() - 0.5f);
                    }
                }

                public class Multiply : ModUpgrade<MathMonkey> {
                    public override int Path => TOP;
                    public override int Tier => 3;
                    public override int Cost => 5400;
                    public override string DisplayName => "Multiply";
                    public override string Description => "Increases range, damage, and attack speed by a factor of 1.3.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.AttackRate(tower.AttackRate() / 1.3f);
                        tower.Range(tower.Range() * 1.3f);
                        tower.Damage(tower.Damage() * 1.3f);
                    }
                }
                public class Divide : ModUpgrade<MathMonkey> {
                    public override int Path => TOP;
                    public override int Tier => 4;
                    public override int Cost => 43000;
                    public override string DisplayName => "Divide";
                    public override string Description => "Adds a second slow-firing attack that divides based on the bloon's size.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        var weapon2 = Game.instance.model.GetTowerFromId("MonkeySub-020").Duplicate().GetAttackModel().weapons[0];
                        weapon2.projectile.AddBehavior(new DamageModifierForTagModel("DamageModifierForTagModel_Moab", "Moab", 1, 40, false, false));
                        weapon2.projectile.AddBehavior(new DamageModifierForTagModel("DamageModifierForTagModel_Bfb", "Bfb", 1, 56, false, false));
                        weapon2.projectile.AddBehavior(new DamageModifierForTagModel("DamageModifierForTagModel_Zomg", "Zomg", 1, 240, false, false));
                        weapon2.projectile.AddBehavior(new DamageModifierForTagModel("DamageModifierForTagModel_Ddt", "Ddt", 1, 19, false, false));
                        weapon2.projectile.AddBehavior(new DamageModifierForTagModel("DamageModifierForTagModel_Bad", "Bad", 1, 400, false, false));
                        tower.GetAttackModel().AddWeapon(weapon2);
                        tower.Pierce(3, 1);
                        tower.AttackRate(tower.AttackRate(1) * 3, 1);
                    }
                }

                public class SolveForX : ModUpgrade<MathMonkey> {
                    public override int Path => TOP;
                    public override int Tier => 5;
                    public override int Cost => 60500;
                    public override string DisplayName => "Solve for X";
                    public override string Description => "Dmg = (Dmg * Rng) / (AtkRt - 2) + 10";

                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.AttackRate(tower.AttackRate(0) * 3, 0);
                        tower.Pierce(1, 0);
                        tower.Damage(tower.Damage(0) * tower.Range() / Mathf.Clamp(tower.AttackRate(0) - 2, 1, 1000) + 10, 0);
                    }
                }

                //Path 2
                public class ZNormalization : ModUpgrade<MathMonkey> {
                    public override int Path => MIDDLE;
                    public override int Tier => 1;
                    public override int Cost => 780;
                    public override string DisplayName => "Z-Normalization";
                    public override string Description => "Normalizes the z-axis. Height no longer affects this monkey.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.IgnoreLineOfSight(true);
                    }
                }

                public class XYNotation : ModUpgrade<MathMonkey> {
                    public override int Path => MIDDLE;
                    public override int Tier => 2;
                    public override int Cost => 1700;
                    public override string DisplayName => "(x, y) notation";
                    public override string Description => "Can relocate by changing its (x, y) values.";
                    public override string Portrait => "CheapTack_Portrait";
                    public override string Icon => "CheapTack_Icon";
                    public override void ApplyUpgrade(TowerModel tower) {
                        var ability = Game.instance.model.GetTowerFromId("SuperMonkey-004").GetAbility().Duplicate();
                        tower.AddBehavior(ability);
                        tower.GetAbility(0).Cooldown = 60;
                    }
                }

                public class LinearEquation : ModUpgrade<MathMonkey> {
                    public override int Path => MIDDLE;
                    public override int Tier => 3;
                    public override int Cost => 1050;
                    public override string DisplayName => "Linear Equation";
                    public override string Description => "Attacks in a straight line.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        var weapon1 = Game.instance.model.GetTowerFromId("BoomerangMonkey-003").Duplicate().GetAttackModel().weapons[0];
                        tower.GetAttackModel().weapons[0] = weapon1;
                    }
                }

                public class PolynomialIntersection : ModUpgrade<MathMonkey> {
                    public override int Path => MIDDLE;
                    public override int Tier => 4;
                    public override int Cost => 9700;
                    public override string DisplayName => "Polynomial Intersection";
                    public override string Description => "Passively increases the pierce of all \"straight-line\" monkeys in radius (Churchill, Dartling, etc.) by 2.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        var filter = new UnhollowerBaseLib.Il2CppReferenceArray<Assets.Scripts.Models.Towers.TowerFilters.TowerFilterModel>(1);
                        var towers = new UnhollowerBaseLib.Il2CppStringArray(10);
                        towers[0] = "DartMonkey";
                        towers[1] = "MonkeyBuccaneer";
                        towers[2] = "HeliPilot";
                        towers[3] = "DartlingGunner";
                        towers[4] = "WizardMonkey";
                        towers[5] = "SuperMonkey";
                        towers[6] = "NinjaMonkey";
                        towers[7] = "EngineerMonkey";
                        towers[8] = "Gwendolin";
                        towers[9] = "CaptainChurchill";
                        var towerFilter = new Assets.Scripts.Models.Towers.TowerFilters.FilterInBaseTowerIdModel("FilterTower", towers);
                        filter[0] = towerFilter;
                        var pierceSupportModel = new PierceSupportModel("MathMonkeyPolynomialPierceBuff",
                            true, 2, "MathMonkey:Polynomial:DamageSupportModel", filter, false, "", "");
                        pierceSupportModel.maxStackSize = 0;
                        pierceSupportModel.showBuffIcon = true;
                        tower.AddBehavior(pierceSupportModel);
                    }
                }

                public class ExponentialExtrapolation : ModUpgrade<MathMonkey> {
                    public override int Path => MIDDLE;
                    public override int Tier => 5;
                    public override int Cost => 32000;
                    public override string DisplayName => "Exponential Extrapolation";
                    public override string Description => "Gain tiny attack speed but exponential buffs while attacking bloons, with no limit! Also increases pierce of all straight-line monkeys, and damage of all in radius.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        var wrathModel = new DamageBasedAttackSpeedModel("ExtrapolationWrathModel", 1000, 9999, 0.05f, 9999);
                        tower.AddBehavior(wrathModel);
                        tower.GetBehavior<PierceSupportModel>().isGlobal = true;
                        var damageSupportModel = new DamageSupportModel("ExtrapolationDamageBuff", true, 1, "MathMonkey:Extrapolate:DamageBuff", tower.GetBehavior<PierceSupportModel>().filters, false, false, 0);
                        tower.AddBehavior(damageSupportModel);
                    }
                }

                //Path 3
                public class Square : ModUpgrade<MathMonkey> {
                    public override int Path => BOTTOM;
                    public override int Tier => 1;
                    public override int Cost => 400;
                    public override string DisplayName => "Square";
                    public override string Description => "Shoots squares instead, which have +2 pierce.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.Pierce(tower.Pierce() + 2);
                    }
                }

                public class TriangleSum : ModUpgrade<MathMonkey> {
                    public override int Path => BOTTOM;
                    public override int Tier => 2;
                    public override int Cost => 630;
                    public override string DisplayName => "Triangle Sum";
                    public override string Description => "Increases range.";

                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.Range(50);
                    }
                }

                public class TrigonometricTerror : ModUpgrade<MathMonkey> {
                    public override int Path => BOTTOM;
                    public override int Tier => 3;
                    public override int Cost => 960;
                    public override string DisplayName => "Trigonometric Terror";
                    public override string Description => "Shots home more aggressively. Also increases pierce, but slightly decreases attack speed.";
                    public override void ApplyUpgrade(TowerModel tower) {
                        float lastDamage = tower.Damage(0);
                        float lastAttackRate = tower.AttackRate(0);
                        float lastPierce = tower.Pierce(0);
                        var weapon1 = Game.instance.model.GetTowerFromId("BoomerangMonkey-300").Duplicate().GetAttackModel().weapons[0];
                        tower.GetAttackModel().weapons[0] = weapon1;
                        tower.Damage(lastDamage);
                        tower.AttackRate(lastAttackRate * 1.3f);
                        tower.Pierce(lastPierce + 4, 0);
                    }
                }

                public class HexagonalTrig : ModUpgrade<MathMonkey> {
                    public override int Path => BOTTOM;
                    public override int Tier => 4;
                    public override int Cost => 17600;
                    public override string DisplayName => "Hexagonal Trig";
                    public override string Description => "Shoots in 6 directions.";
                    public override void ApplyUpgrade(TowerModel tower) {
                        tower.GetWeapon().emission = new ArcEmissionModel("ArcEmissionModel_Hexagon", 6, 0, 360, null, false);
                        tower.Damage(tower.Damage() + 1);
                        tower.Pierce(tower.Pierce() + 4);
                    }
                }

                public class GeometricGemini : ModUpgrade<MathMonkey> {
                    public override int Path => BOTTOM;
                    public override int Tier => 5;
                    public override int Cost => 24000;
                    public override string DisplayName => "Geometric Gemini";
                    public override string Description => "Shoots different shapes with different properties for 360° bloon destruction.";
                    public override void ApplyUpgrade(TowerModel tower) {
                        //Weapon 1: Hexagon
                        tower.Damage(tower.Damage() + 1, 0);
                        tower.GetWeapon().emission = new ArcEmissionModel("ArcEmissionModel_Hexagon", 6, 0, 360, null, false);
                        tower.Damage(tower.Damage() + 1);
                        tower.Pierce(tower.Pierce() + 4);
                        //Weapon 2: Square
                        var weapon2 = Game.instance.model.GetTowerFromId("MonkeySub").Duplicate().GetAttackModel().weapons[0];
                        weapon2.emission = new ArcEmissionModel("ArcEmissionModel_Squares", 6, 15, 360, null, false);
                        tower.GetAttackModel().AddWeapon(weapon2);
                        tower.Damage(4, 1);
                        tower.Pierce(15, 1);
                        tower.AttackRate(1, 1);
                        //Weapon 3: Triangle
                        var weapon3 = Game.instance.model.GetTowerFromId("MonkeySub").Duplicate().GetAttackModel().weapons[0];
                        weapon3.emission = new ArcEmissionModel("ArcEmissionModel_Triangles", 6, 30, 360, null, false);
                        tower.GetAttackModel().AddWeapon(weapon3);
                        tower.Damage(10, 1);
                        tower.Pierce(3, 1);
                        tower.AttackRate(1.25f, 1);
                        //Weapon 4: Circle
                        var weapon4 = Game.instance.model.GetTowerFromId("MonkeySub").Duplicate().GetAttackModel().weapons[0];
                        weapon4.emission = new ArcEmissionModel("ArcEmissionModel_Circles", 6, 45, 360, null, false);
                        tower.GetAttackModel().AddWeapon(weapon4);
                        tower.Damage(2, 1);
                        tower.Pierce(2, 1);
                        tower.AttackRate(0.25f, 1);
                    }
                }
            }
        }
    }
}
