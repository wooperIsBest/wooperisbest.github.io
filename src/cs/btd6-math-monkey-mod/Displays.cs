using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Assets.Scripts.Unity.Display;
using BTD_Mod_Helper.Api.Display;

namespace MathMonkeyMod.Resources.Projectiles {
    public class PencilDisplay : ModDisplay {
        public override string BaseDisplay => Generic2dDisplay;

        public override void ModifyDisplayNode(UnityDisplayNode node) {
            Set2DTexture(node, "Resources/Projectiles/Pencil");
        }
    }
}
