const ColorNamer = require('color-namer')
const fs = require('fs')

const Globals = require('../game_data/database/globals.json')
const Templates = require('../game_data/database/locales/global/en.json').templates

function ArmorDurability() {
    let Result = new Object()

    const ArmorMaterials = Globals.config.ArmorMaterials

    for (const MaterialName in ArmorMaterials) {
        Result[MaterialName] = ArmorMaterials[MaterialName].Destructibility
    }

    return Result
}

class ItemInfo {
    constructor(item) {
        this.AllData = JSON.parse(fs.readFileSync('./src/game_data/api/itemdata.json'))
        this.ItemID = item
        this.ItemData = this.AllData[item]
        this.Description = this.GetDescription()
        this.SpecificData = this.GetSpecificData()
        this.WikiLink = this.ItemData.WikiLink
        this.Name = this.ItemData.Name
        this.ShortName = this.ItemData.ShortName
    }
    GetDescription() {
        if (Templates[this.ItemID] !== undefined) {
            return Templates[this.ItemID].Description
        } else {
            return this.ItemData.Name
        }
    }
    GetSpecificData() {
        try {
            let RawData = this.ItemData.RawData._props

            let Types = this.ItemData.Types

            if (Types.includes('ammo') && !Types.includes('grenade')) {
                // Need to add ammo specific traits in here like buckshot pellets
                return {
                    Fields: [
                        { name: 'Damage', value: RawData.Damage, inline: true },
                        { name: 'Penetration', value: RawData.PenetrationPower, inline: true },
                        { name: 'Armor Damage', value: `${RawData.ArmorDamage}%`, inline: true },
                        { name: 'Bullet Velocity', value: `${RawData.InitialSpeed}m/s`, inline: true },
                        { name: 'Stamina Drain On Hit', value: RawData.StaminaBurnPerDamage, inline: true },
                        { name: 'Fragmentation Chance', value: `${RawData.FragmentationChance}%`, inline: true },
                        { name: 'Tracer?', value: RawData.Tracer, inline: true },
                        { name: 'Light Bleed Chance', value: `${RawData.LightBleedingDelta}%`, inline: true },
                        { name: 'Heavy Bleed Chance', value: `${RawData.HeavyBleedingDelta}%`, inline: true }
                    ]
                }
            } else if (Types.includes('wearable') && !Types.includes('gun') || RawData.Name == 'ПНВ') {
                let Object = {
                    Fields: []
                }
                if (RawData.Grids.length > 0) {
                    Object.Fields.push({ name: 'Size', value: (RawData.Width * RawData.Height), inline: true })
                    Object.Fields.push({ name: 'Container Size', value: this.GetContainerSize(), inline: true })
                    Object.Fields.push({ name: 'Space Efficiency', value: this.GetSpaceEfficiency(), inline: true })
                    Object['Image'] = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/rig_images/${this.ItemData.ID}.png`
                    Object['Footer'] = 'Rig inside views provided by the wiki'
                }
                if (RawData.MaskSize !== undefined) { // Night Vision
                    let GoggleColorName = ColorNamer(`rgb(${RawData.Color.r},${RawData.Color.g},${RawData.Color.b})`, { pick: ['x11'] })['x11'][0].name
                    GoggleColorName = GoggleColorName[0].toUpperCase() + GoggleColorName.substr(1)

                    Object.Fields.push({ name: 'Goggle Color', value: [`Name: **${GoggleColorName}**`, `R: ${RawData.Color.r}, G: ${RawData.Color.g}, B: ${RawData.Color.b}, A: ${RawData.Color.a}`] }),
                        Object.Fields.push({ name: 'Diffuse Intensity', value: RawData.DiffuseIntensity }),
                        Object.Fields.push({ name: 'Intensity', value: RawData.Intensity })
                    Object['Image'] = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/nvg_ingame/${this.ItemData.ID}.png`
                    Object['Footer'] = 'Night vision image from the wiki'
                }
                return Object
            } else if (RawData.CompressorTreshold !== undefined) {
                return {
                    Fields: [
                        { name: 'Distortion', value: RawData.Distortion, inline: true },
                        { name: 'Compressor Treshold', value: RawData.CompressorTreshold, inline: true },
                        { name: 'Compressor Attack', value: RawData.CompressorAttack, inline: true },
                        { name: 'Compressor Release', value: RawData.CompressorRelease, inline: true },
                        { name: 'Compressor Gain', value: RawData.CompressorGain, inline: true },
                        { name: 'Cutoff Freq', value: RawData.CutoffFreq, inline: true },
                        { name: 'Resonance', value: RawData.Resonance, inline: true },
                        { name: 'Compressor Volume', value: RawData.CompressorVolume, inline: true },
                        { name: 'Ambient Volume', value: RawData.AmbientVolume, inline: true },
                        { name: 'Dry Volume', value: RawData.DryVolume, inline: true }
                    ]
                }
            } else if (Types.includes('gun')) {
                return {
                    Fields: [
                        { name: 'Vertical Recoil', value: RawData.RecoilForceUp, inline: true },
                        { name: 'Horizontal Recoil', value: RawData.RecoilForceBack, inline: true },
                        { name: 'FireModes', value: RawData.weapFireType, inline: true },
                        { name: 'FireRate', value: RawData.bFirerate, inline: true },
                        { name: 'Ergonomics', value: RawData.Ergonomics, inline: true },
                        { name: 'Caliber', value: RawData.ammoCaliber, inline: true }
                    ]
                }
            } else if (Types.includes('armor')) {
                let Object = {
                    Fields: [
                        { name: 'Armor Level', value: RawData.armorClass, inline: true },
                        { name: 'Durabiltiy', value: RawData.MaxDurability, inline: true },
                        { name: 'Effective Durability', value: this.GetEffective(), inline: true },
                        { name: 'Speed Penalty', value: `${RawData.speedPenaltyPercent}%`, inline: true },
                        { name: 'Sensitivity Penalty', value: `${RawData.mousePenalty}%`, inline: true },
                        { name: 'Ergonomic Penalty', value: `${RawData.weaponErgonomicPenalty}%`, inline: true },
                        { name: 'Armor Areas', value: RawData.armorZone, inline: true },
                        { name: 'Material', value: RawData.ArmorMaterial, inline: true },
                        { name: 'Weight', value: `${RawData.Weight}kg`, inline: true }
                    ]
                }
                if (RawData.Grids.length > 0) {
                    Object.Fields.push({ name: 'Size', value: (RawData.Width * RawData.Height), inline: true })
                    Object.Fields.push({ name: 'Container Size', value: this.GetContainerSize(), inline: true })
                    Object.Fields.push({ name: 'Space Efficiency', value: this.GetSpaceEfficiency(), inline: true })
                    Object['Image'] = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/rig_images/${this.ItemData.ID}.png`
                    Object['Footer'] = 'Rig inside views provided by the wiki'
                }
                return Object
            } else if (Types.includes('backpack')) {
                return {
                    Fields: [
                        { name: 'Size', value: (RawData.Width * RawData.Height), inline: true },
                        { name: 'Container Size', value: this.GetContainerSize(), inline: true },
                        { name: 'Space Efficiency', value: this.GetSpaceEfficiency(), inline: true },
                        { name: 'Speed Penalty', value: RawData.speedPenaltyPercent, inline: true }
                    ]
                }
            } else if (Types.includes('grenade')) {
                let Object = {
                    Fields: [
                        { name: 'Fuse Time', value: RawData.ExplDelay, inline: true },
                        { name: 'Min/Max Explosion Distance', value: `${RawData.MinExplosionDistance}/${RawData.MaxExplosionDistance}m`, inline: true },
                        { name: 'Fragment Count', value: RawData.FragmentsCount, inline: true },
                        { name: 'Strength', value: RawData.Strength, inline: true },
                        { name: 'Fragment Damage', value: RawData.FragmentsCount, inline: true }
                        //{ name: 'Max Damage', value: (RawData.FragmentsCount * RawData.Strength), inline: true, }
                    ]
                }
                if (RawData.ContusionDistance !== 0) {
                    Object.Fields.push({ name: 'Flash Distance', value: `${RawData.ContusionDistance}m`, inline: true })
                }
                return Object
            } else if (Types.includes('glasses')) {
                if (RawData.FaceShieldComponent) {
                    return {
                        Fields: [
                            { name: 'Armor Class', value: RawData.armorClass, inline: true },
                            { name: 'Durability', value: RawData.MaxDurability, inline: true },
                            { name: 'Effective Durability', value: this.GetEffective(), inline: true },
                            { name: 'Speed Penalty', value: `${RawData.speedPenaltyPercent}%`, inline: true },
                            { name: 'Sensitivity Penalty', value: `${RawData.mousePenalty}%`, inline: true },
                            { name: 'Ergonomic Penalty', value: `${RawData.weaponErgonomicPenalty}%`, inline: true },
                            { name: 'Blindness Protection', value: RawData.BlindnessProtection },
                            { name: 'Armor Zones', value: RawData.headSegments }
                        ]
                    }
                } else {
                    return {
                        Fields: [
                            { name: 'Blindness Protection', value: RawData.BlindnessProtection },
                        ]
                    }
                }
            } else if (Types.includes('helmet')) {
                return {
                    Fields: [
                        { name: 'Armor Class', value: RawData.armorClass, inline: true },
                        { name: 'Durability', value: RawData.MaxDurability, inline: true },
                        { name: 'Effective Durability', value: this.GetEffective(), inline: true },
                        { name: 'Speed Penalty', value: `${RawData.speedPenaltyPercent}%`, inline: true },
                        { name: 'Sensitivity Penalty', value: `${RawData.mousePenalty}%`, inline: true },
                        { name: 'Ergonomic Penalty', value: `${RawData.weaponErgonomicPenalty}%`, inline: true },
                        { name: 'Armor Zones', value: RawData.headSegments, inline: true }
                    ]
                }
            } else if (Types.includes('mods') && !Types.includes('noFlea')) {
                let Object = {
                    Fields: [
                        { name: 'Ergonomics', value: RawData.Ergonomics, inline: true },
                        { name: 'Recoil', value: `${RawData.Recoil}%`, inline: true }
                    ]
                }
                if (RawData.Name.includes('mag_')) { // Magazine
                    Object.Fields.push({ name: 'Mag Size', value: RawData.Cartridges._max_count, inline: true })
                    Object.Fields.push({ name: 'Check Time', value: `${RawData.CheckTimeModifier}%`, inline: true })
                    Object.Fields.push({ name: 'Load/Unload Time', value: `${RawData.LoadUnloadModifier}%`, inline: true })
                } else if (RawData.Name.includes('pistolgrip_')) { // Pistol Grip

                } else if (RawData.Name.includes('silencer_')) { // Silencer
                    Object.Fields.push({ name: 'Loudness', value: RawData.Loudness, inline: true })
                    Object.Fields.push({ name: 'Velocity', value: RawData.Velocity, inline: true })
                } else if (RawData.Name.includes('muzzle_')) { // Muzzle Device
                    Object.Fields.push({ name: 'Velocity', value: RawData.Velocity, inline: true })
                } else if (RawData.Name.includes('reciever_')) { // Upper Receiver

                } else if (RawData.Name.includes('scope_') || RawData.Zooms !== undefined) { // Scope
                    Object.Fields.push({ name: '\u200b', value: '\u200b', inline: true })
                    Object.Fields.push({ name: 'Zooms', value: RawData.Zooms[0], inline: true })
                    Object.Fields.push({ name: 'Sensitivity', value: RawData.AimSensitivity[0], inline: true })

                    Object['Image'] = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/reticles/${this.ItemData.ID}.png`

                    if (this.ItemData.ShortName === 'REAP-IR' || this.ItemData.ShortName === 'RS-32') {
                        Object['Image'] = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/thermal_ingame/${this.ItemData.ID}.png`
                        Object['Footer'] = 'Thermal images from the wiki'
                    }
                }
                return Object
            } else if (Types.includes('barter') && Types.includes('markedOnly') || this.ItemData.ShortName === 'SICC') { // Case
                return {
                    Fields: [
                        { name: 'Size', value: (RawData.Width * RawData.Height), inline: true },
                        { name: 'Container Size', value: this.GetContainerSize(), inline: true },
                        { name: 'Space Efficiency', value: this.GetSpaceEfficiency(), inline: true },
                    ],
                    Image: `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/container_images/${this.ItemData.ID}.png`
                }
            } else if (Types.includes('provisions')) {
                let Object = {
                    Fields: [
                        { name: 'Use Time', value: `${RawData.foodUseTime || RawData.medUseTime}s`, inline: true }
                    ]
                }
                if (RawData.effects_health !== undefined && !Array.isArray(RawData.effects_health)) {
                    Object.Fields.push({ name: 'Health Effects', value: this.GetHealthEffects(), inline: true })
                }
                if (RawData.effects_damage !== undefined && !Array.isArray(RawData.effects_damage)) {
                    Object.Fields.push({ name: 'Damage Effects', value: this.GetDamageEffects(), inline: true })
                }
                if (RawData.MaxHpResource !== undefined && RawData.MaxHpResource > 0) {
                    Object.Fields.push({ name: 'Max hp', value: RawData.MaxHpResource, inline: true })
                } else {
                    Object.Fields.push({ name: '\u200b', value: '\u200b', inline: true })
                }
                if (Globals.config.Health.Effects.Stimulator.Buffs[`Buffs${this.ItemData.ShortName.split(' ').join('')}`] !== undefined) {
                    let StimData = Globals.config.Health.Effects.Stimulator.Buffs[`Buffs${this.ItemData.ShortName.split(' ').join('')}`]
                    Object.Fields.push({ name: 'Buffs', value: this.GetStimEffects(StimData), inline: true })
                }
                return Object
            } else {
                return {
                    Fields: [
                        { name: 'No specific data for this item yet', value: '\u200B' }
                    ]
                }
            }
        } catch {
            return {
                Fields: [
                    { name: 'UNABLE TO GET ITEM DATA', value: 'Please try again at a later date' }
                ]
            }
        }
    }
    GetEffective() {
        try {
            let Material = this.ItemData.RawData._props.ArmorMaterial
            let Destructability = ArmorDurability()[Material]
            let Durability = this.ItemData.RawData._props.Durability

            return Math.round(Durability / Destructability)
        } catch {
            return 'ERROR'
        }
    }
    GetContainerSize() {
        try {
            let RawData = this.ItemData.RawData._props
            let Grids = RawData.Grids
            let Size = 0

            for (const i in Grids) {
                let Grid = Grids[i]
                Size = Size + (Grid._props.cellsH * Grid._props.cellsV)
            }

            return Size
        } catch {
            return 'ERROR'
        }
    }
    GetSpaceEfficiency() {
        try {
            let RawData = this.ItemData.RawData._props
            let SpaceEfficiency = this.GetContainerSize() / (RawData.Width * RawData.Height)
            return Math.round(SpaceEfficiency * 100) / 100
        } catch {
            return 'ERROR'
        }
    }
    GetHealthEffects() {
        try {
            let Effects = new Array()
            let RawData = this.ItemData.RawData._props
            if (RawData.effects_health !== undefined) {
                for (const e in RawData.effects_health) {
                    let Effect = RawData.effects_health[e]
                    let CurrentEffect = `${e} - `

                    if (Effect.value !== undefined) {
                        CurrentEffect = `${CurrentEffect} Amount: ${Effect.value}`
                    }
                    if (Effect.duration !== undefined) {
                        CurrentEffect = `${CurrentEffect} Duration: ${Effect.duration}s`
                    }
                    if (Effect.delay !== undefined) {
                        CurrentEffect = `${CurrentEffect} Delay: ${Effect.delay}s`
                    }
                    if (Effect.cost !== undefined) {
                        CurrentEffect = `${CurrentEffect} Cose: ${Effect.cose}hp`
                    }
                    Effects.push(CurrentEffect)
                }
            }
            return Effects
        } catch {
            return 'ERROR'
        }
    }
    GetDamageEffects() {
        try {
            let Effects = new Array()
            let RawData = this.ItemData.RawData._props
            if (RawData.effects_damage !== undefined) {
                for (const e in RawData.effects_damage) {
                    let Effect = RawData.effects_damage[e]
                    let CurrentEffect = `${e} - `

                    if (e !== 'RadExposure') {
                        if (Effect.value !== undefined) {
                            CurrentEffect = `${CurrentEffect} Amount: ${Effect.value}`
                        }
                        if (Effect.duration !== undefined) {
                            if (Effect.duration > 0) {
                                CurrentEffect = `${CurrentEffect} Duration: ${Effect.duration}s`
                            }
                        }
                        if (Effect.delay !== undefined) {
                            if (Effect.delay > 0) {
                                CurrentEffect = `${CurrentEffect} Delay: ${Effect.delay}s`
                            }
                        }
                        if (Effect.cost !== undefined) {
                            CurrentEffect = `${CurrentEffect} Cost: ${Effect.cost}hp`
                        }
                        Effects.push(CurrentEffect)
                    }
                }
            }
            return Effects
        } catch {
            return 'ERROR'
        }
    }
    GetStimEffects(EffectTypes) {
        try {
            let Effects = new Array()
            for (const i in EffectTypes) {
                let StimData = EffectTypes[i]
                let Effect = ''
                if (StimData.BuffType === "SkillRate") {
                    Effect = `${StimData.SkillName} - `
                } else {
                    Effect = `${StimData.BuffType} - `
                }
                if (StimData.Chance > 1) {
                    Effect = `${Effect} Chance: ${StimData.Chance}%`
                }
                if (StimData.Delay > 1) {
                    Effect = `${Effect} Delay: ${StimData.Delay}s`
                }
                Effect = `${Effect} Duration: ${StimData.Duration}s`
                if (StimData.Value > 0) {
                    Effect = `${Effect} Value: ${StimData.Value}`
                }
                Effects.push(Effect)
            }
            return Effects
        } catch {
            return 'ERROR'
        }
    }
}

exports.ItemInfo = ItemInfo