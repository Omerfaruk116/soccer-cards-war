import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PlayerCard from "./components/PlayerCard";

import {
  calculatePlayerPrice,
  calculateRentalIncome,
  calculateTrainingCost,
  coachConfigs,
  countries,
  createCustomPlayer,
  createStageRewardPlayer,
  eventConfigs,
  generateEventShop,
  generateMarketPlayers,
  generateOpponentDeck,
  generateRewardChoices,
  generateStarterPlayers,
  getCountryFlag,
  getEventConfig,
  getPositionGroup,
  getRarity,
  getUpgradePackReward,
  positionGroups,
  positions,
  rentalCenterConfig,
  shuffle,
  stageRewards,
  trainingPlans,
} from "./data/players";

import {
  EVENT_MATCH_COOLDOWN_MS,
  canRentPlayer,
  canSellPlayer,
  canSendToTraining,
  canStartCareer,
  canStartEvent,
  formatPlayTime,
  getActivePlayers,
  getDailyRewardRemaining,
  getEventCooldownRemaining,
  getSquadProblems,
  isDailyRewardReady,
  isPlayerBusy,
  millisecondsToClock,
} from "./utils/gameRules";

import {
  buildBestLineup,
} from "./utils/autoLineup";

import {
  calculateEventCurrencyReward,
  calculateRoundResult,
  chooseOpponentForRound,
  createRandomFiveRounds,
  getAvailablePlayersForRound,
  getRoundLabel,
} from "./utils/battleEngine";

const SAVE_KEY =
  "soccer-cards-war-save-v5";

const SAVE_VERSION = 5;

const STORE_TEST_MODE = true;

const HOME_HISTORY = {
  scw: true,
  view: "home",
};

const COIN_PACKAGES = [
  {
    id: "coins-3000",
    coins: 3000,
    price: "$1.00",
  },
  {
    id: "coins-5000",
    coins: 5000,
    price: "$1.50",
  },
  {
    id: "coins-12000",
    coins: 12000,
    price: "$3.00",
  },
  {
    id: "coins-30000",
    coins: 30000,
    price: "$6.00",
  },
  {
    id: "coins-75000",
    coins: 75000,
    price: "$12.00",
  },
];

const TEAM_SLOTS = [
  {
    id: "fw1",
    label: "FORVET",
    group: "forward",
  },
  {
    id: "fw2",
    label: "FORVET",
    group: "forward",
  },

  {
    id: "mid1",
    label: "ORTA SAHA",
    group: "midfield",
  },
  {
    id: "mid2",
    label: "ORTA SAHA",
    group: "midfield",
  },
  {
    id: "mid3",
    label: "ORTA SAHA",
    group: "midfield",
  },

  {
    id: "def1",
    label: "DEFANS",
    group: "defense",
  },
  {
    id: "def2",
    label: "DEFANS",
    group: "defense",
  },
  {
    id: "def3",
    label: "DEFANS",
    group: "defense",
  },
  {
    id: "def4",
    label: "DEFANS",
    group: "defense",
  },

  {
    id: "gk",
    label: "KALECİ",
    group: "goalkeeper",
  },
];

const APP_CSS = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #07090d;
    color: #f3f5f7;
    font-family:
      Inter,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  .app-shell {
    width: min(100%, 980px);
    margin: 0 auto;
    padding: 12px 12px 48px;
  }

  .top-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 0;
    background: rgba(7, 9, 13, .94);
    backdrop-filter: blur(14px);
  }

  .club-button,
  .profile-small-button {
    border: 1px solid #303742;
    background: #10151c;
    color: white;
    border-radius: 13px;
    min-height: 44px;
  }

  .club-button {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 10px;
    text-align: left;
    min-width: 0;
  }

  .club-button img {
    width: 34px;
    height: 34px;
    border-radius: 9px;
  }

  .club-name {
    font-size: 13px;
    font-weight: 950;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  .club-sub {
    color: #737d89;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .08em;
  }

  .top-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .currency {
    padding: 7px 9px;
    border: 1px solid #282f38;
    border-radius: 11px;
    background: #0d1116;
    font-size: 11px;
    font-weight: 900;
  }

  .profile-small-button {
    width: 44px;
    font-size: 20px;
  }

  .page-card,
  .panel {
    border: 1px solid #292f38;
    border-radius: 18px;
    background:
      linear-gradient(
        145deg,
        #11161d,
        #090c10
      );
  }

  .page-card {
    padding: 18px;
  }

  .panel {
    padding: 15px;
  }

  .section-title {
    margin: 0 0 5px;
    font-size: 24px;
    font-weight: 1000;
  }

  .section-subtitle {
    margin: 0;
    color: #7e8792;
    font-size: 11px;
    line-height: 1.5;
  }

  .section-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 16px;
  }

  .back-button,
  .primary-button,
  .secondary-button,
  .danger-button,
  .gold-button,
  .blue-button,
  .green-button {
    min-height: 44px;
    padding: 0 15px;
    border-radius: 11px;
    border: 1px solid transparent;
    font-weight: 950;
  }

  .back-button,
  .secondary-button {
    border-color: #303740;
    background: #11161c;
    color: #cfd5db;
  }

  .primary-button {
    background: #eceff3;
    color: #080a0d;
  }

  .danger-button {
    background: #3d1717;
    border-color: #6a2727;
    color: #ffb0a8;
  }

  .gold-button {
    background:
      linear-gradient(
        135deg,
        #78581b,
        #3f2c0d
      );
    border-color: #8d6b2b;
    color: #ffda82;
  }

  .blue-button {
    background:
      linear-gradient(
        135deg,
        #153b67,
        #0c203c
      );
    border-color: #245d98;
    color: #9ed1ff;
  }

  .green-button {
    background:
      linear-gradient(
        135deg,
        #174d35,
        #0c2a1d
      );
    border-color: #287b57;
    color: #a7f4ce;
  }

  .menu-grid,
  .folder-grid {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .menu-card,
  .folder-card {
    min-height: 142px;
    padding: 16px;
    border: 1px solid #303640;
    border-radius: 17px;
    color: white;
    text-align: left;
    background: #11161c;
    overflow: hidden;
    position: relative;
  }

  .menu-card strong,
  .folder-card strong {
    display: block;
    font-size: 18px;
    margin-top: 7px;
  }

  .menu-card span,
  .folder-card span {
    display: block;
    margin-top: 4px;
    color: rgba(255,255,255,.68);
    font-size: 10px;
    line-height: 1.4;
  }

  .menu-icon {
    font-size: 30px;
  }

  .folder-match {
    background:
      radial-gradient(
        circle at 85% 10%,
        rgba(255,79,0,.30),
        transparent 35%
      ),
      linear-gradient(
        145deg,
        #3e140d,
        #160908
      );
    border-color: #87331f;
  }

  .folder-team {
    background:
      radial-gradient(
        circle at 85% 10%,
        rgba(30,220,120,.20),
        transparent 35%
      ),
      linear-gradient(
        145deg,
        #123723,
        #081810
      );
    border-color: #2b6e49;
  }

  .folder-shopping {
    background:
      radial-gradient(
        circle at 85% 10%,
        rgba(225,170,55,.20),
        transparent 35%
      ),
      linear-gradient(
        145deg,
        #382b10,
        #171108
      );
    border-color: #765a25;
  }

  .folder-career {
    background:
      linear-gradient(
        145deg,
        #40130c,
        #160a08
      );
    border-color: #88321f;
  }

  .folder-event {
    background:
      linear-gradient(
        145deg,
        #102d4f,
        #08121f
      );
    border-color: #275b91;
  }

  .folder-training {
    background:
      linear-gradient(
        145deg,
        #123724,
        #091a11
      );
    border-color: #286747;
  }

  .folder-transfer {
    background:
      linear-gradient(
        145deg,
        #392c11,
        #171208
      );
    border-color: #705825;
  }

  .auto-lineup-button {
    width: 100%;
    min-height: 52px;
    margin: 0 0 14px;
    border: 1px solid #d39b36;
    border-radius: 13px;
    color: #ffe1a1;
    font-weight: 1000;
    background:
      linear-gradient(
        135deg,
        #5a3f10,
        #241907
      );
  }

  .info-box {
    margin: 12px 0 16px;
    padding: 12px 14px;
    border: 1px solid #2c3540;
    border-radius: 12px;
    background: #0c1117;
    color: #84909d;
    font-size: 10px;
    line-height: 1.5;
  }

  .notice {
    margin: 10px 0;
    padding: 12px 14px;
    border: 1px solid #6f5622;
    border-radius: 12px;
    background: #241b0c;
    color: #f1cd79;
    font-weight: 850;
    font-size: 11px;
  }

  .event-money {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 8px 0;
    padding: 8px 12px;
    border: 1px solid #8e5720;
    border-radius: 12px;
    background: #2e1a09;
    color: #ffb654;
    font-weight: 1000;
  }

  .player-grid {
    display: grid;
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
    gap: 11px;
  }

  .player-card {
    width: 100%;
    min-width: 0;
    border-radius: 15px;
    padding: 10px;
    border: 1px solid #38414b;
    color: white;
    background:
      linear-gradient(
        145deg,
        #1a2027,
        #0c1015
      );
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .player-card:disabled {
    opacity: .58;
  }

  .player-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .player-overall {
    font-size: 24px;
    font-weight: 1000;
  }

  .player-position {
    font-size: 9px;
    font-weight: 900;
    color: #a9b0b8;
  }

  .player-flag {
    font-size: 20px;
  }

  .player-group-label {
    margin-top: 5px;
    font-size: 8px;
    font-weight: 1000;
    color: #8c96a2;
  }

  .player-portrait {
    width: 62px;
    height: 62px;
    margin: 9px auto;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #11171d;
    border: 1px solid #3a444f;
    font-size: 19px;
    font-weight: 1000;
  }

  .player-name {
    font-size: 11px;
    font-weight: 950;
    line-height: 1.15;
    min-height: 26px;
  }

  .player-rarity,
  .custom-player-label,
  .selected-player-label,
  .player-status-label,
  .stage-reward-label,
  .player-price {
    margin-top: 5px;
    font-size: 8px;
    font-weight: 950;
  }

  .player-card-elturco,
  .rarity-elturco {
    border: 2px solid #ff9d27;
    background:
      linear-gradient(
        145deg,
        #501506,
        #120705
      );
  }

  .player-card-sold,
  .player-card-locked {
    filter: grayscale(1);
    opacity: .48;
  }

  .team-field {
    margin: 15px 0;
    padding: 18px 12px;
    border-radius: 18px;
    border: 1px solid #245d41;
    background:
      linear-gradient(
        180deg,
        #123b29,
        #0a2319
      );
  }

  .team-row {
    display: grid;
    gap: 8px;
    margin: 8px 0;
  }

  .team-row.two {
    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }

  .team-row.three {
    grid-template-columns:
      repeat(3, minmax(0,1fr));
  }

  .team-row.four {
    grid-template-columns:
      repeat(4, minmax(0,1fr));
  }

  .team-row.one {
    grid-template-columns:
      minmax(0, 180px);
    justify-content: center;
  }

  .squad-slot {
    min-height: 100px;
    border-radius: 13px;
    border: 1px dashed #6d9180;
    background: rgba(0,0,0,.2);
    color: white;
    padding: 8px;
  }

  .squad-slot.filled {
    border-style: solid;
    background: rgba(0,0,0,.35);
  }

  .slot-name {
    display: block;
    font-size: 10px;
    font-weight: 1000;
  }

  .slot-player-name {
    display: block;
    margin-top: 8px;
    font-size: 10px;
    font-weight: 900;
  }

  .slot-overall {
    font-size: 24px;
    font-weight: 1000;
  }

  .list-grid {
    display: grid;
    gap: 10px;
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border: 1px solid #29313a;
    border-radius: 13px;
    background: #0d1218;
  }

  .action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tabs {
    display: flex;
    gap: 7px;
    overflow-x: auto;
    margin: 12px 0;
    padding-bottom: 4px;
  }

  .tab-button {
    min-height: 40px;
    flex: 0 0 auto;
    padding: 0 12px;
    border: 1px solid #303841;
    border-radius: 10px;
    background: #10151b;
    color: #aeb5bd;
    font-weight: 900;
  }

  .tab-button.active {
    color: white;
    border-color: #846429;
    background: #34270e;
  }

  .battle-score {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin: 15px 0;
  }

  .battle-score div {
    min-width: 90px;
    text-align: center;
  }

  .battle-score span {
    display: block;
    color: #808a95;
    font-size: 9px;
  }

  .battle-score strong {
    display: block;
    font-size: 30px;
  }

  .battle-hand {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0,1fr));
    gap: 10px;
  }

  .battle-group {
    text-align: center;
    margin: 14px 0;
    font-size: 18px;
    font-weight: 1000;
  }

  .round-plan {
    display: flex;
    gap: 6px;
    margin: 12px 0;
    overflow-x: auto;
  }

  .round-chip {
    flex: 0 0 auto;
    padding: 6px 9px;
    border-radius: 20px;
    border: 1px solid #303840;
    background: #10151b;
    color: #747f8a;
    font-size: 9px;
    font-weight: 950;
  }

  .round-chip.active {
    border-color: #a77129;
    background: #35230c;
    color: #ffd489;
  }

  .round-chip.done {
    opacity: .5;
  }

  .reward-card-back {
    min-height: 210px;
    border: 1px solid #725622;
    border-radius: 15px;
    background:
      radial-gradient(
        circle,
        #302817,
        #0d0b08
      );
    color: #e6bd64;
    font-size: 38px;
    font-weight: 1000;
  }

  .reward-grid {
    display: grid;
    grid-template-columns:
      repeat(3, minmax(0,1fr));
    gap: 12px;
  }

  .modal-backdrop {
    position: fixed;
    z-index: 100;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(0,0,0,.76);
  }

  .modal {
    width: min(100%, 430px);
    padding: 18px;
    border: 1px solid #3a424c;
    border-radius: 17px;
    background: #11161c;
  }

  .profile-stat-grid {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0,1fr));
    gap: 9px;
  }

  .profile-stat {
    padding: 13px;
    border: 1px solid #2b333c;
    border-radius: 12px;
    background: #0b1015;
  }

  .profile-stat span {
    display: block;
    color: #75808b;
    font-size: 9px;
  }

  .profile-stat strong {
    display: block;
    margin-top: 3px;
    font-size: 16px;
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #222a32;
  }

  .switch-button {
    min-width: 76px;
    min-height: 38px;
    border-radius: 20px;
    border: 1px solid #303943;
    background: #151b22;
    color: #9da6af;
    font-size: 10px;
    font-weight: 950;
  }

  .switch-button.on {
    border-color: #347d59;
    background: #163723;
    color: #9ff0c5;
  }

  .rental-slot-grid,
  .coach-grid,
  .shop-grid,
  .stage-reward-grid {
    display: grid;
    grid-template-columns:
      repeat(2, minmax(0,1fr));
    gap: 10px;
  }

  .rental-slot,
  .coach-card,
  .shop-card,
  .stage-reward-card {
    padding: 13px;
    border: 1px solid #2c343e;
    border-radius: 13px;
    background: #0d1218;
  }

  .stage-reward-card.locked {
    filter: grayscale(1);
    opacity: .42;
  }

  .status-pill {
    display: inline-flex;
    margin-top: 7px;
    padding: 4px 8px;
    border-radius: 20px;
    background: #161d25;
    color: #8f99a4;
    font-size: 8px;
    font-weight: 950;
  }

  .big-number {
    font-size: 30px;
    font-weight: 1000;
  }

  .setup-screen,
  .intro-screen {
    min-height: 76vh;
    display: grid;
    place-items: center;
  }

  .intro-box,
  .setup-box {
    width: min(100%, 430px);
    text-align: center;
  }

  .intro-logo {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
  }

  .text-input,
  .select-input {
    width: 100%;
    min-height: 46px;
    padding: 0 12px;
    border: 1px solid #343d47;
    border-radius: 11px;
    background: #0c1117;
    color: white;
  }

  .field-label {
    display: block;
    margin: 12px 0 6px;
    color: #8b949e;
    font-size: 10px;
    font-weight: 900;
    text-align: left;
  }

  @media (max-width: 720px) {
    .player-grid {
      grid-template-columns:
        repeat(2, minmax(0,1fr));
    }

    .top-right .currency:nth-child(2),
    .top-right .currency:nth-child(3) {
      display: none;
    }

    .team-row.four {
      grid-template-columns:
        repeat(2, minmax(0,1fr));
    }
  }

  @media (max-width: 430px) {
    .menu-grid,
    .folder-grid {
      grid-template-columns:
        1fr 1fr;
      gap: 9px;
    }

    .menu-card,
    .folder-card {
      min-height: 125px;
      padding: 12px;
    }

    .reward-grid {
      gap: 6px;
    }

    .reward-card-back {
      min-height: 155px;
    }

    .rental-slot-grid,
    .coach-grid,
    .shop-grid,
    .stage-reward-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function buildInitialFormation(
  starters
) {
  const result = {};
  const used = new Set();

  TEAM_SLOTS.forEach(
    (slot) => {
      const found =
        starters.find(
          (player) => {
            if (
              used.has(
                player.id
              )
            ) {
              return false;
            }

            const group =
              player.positionGroup ||
              getPositionGroup(
                player.position
              );

            return (
              group ===
              slot.group
            );
          }
        );

      if (found) {
        result[
          slot.id
        ] = found.id;

        used.add(
          found.id
        );
      }
    }
  );

  return result;
}

function createEventStates(
  withShops = false
) {
  return Object.fromEntries(
    eventConfigs.map(
      (event, index) => [
        event.id,
        {
          match: 1,
          wins: 0,
          currency: 0,
          completed: false,
          nextMatchAt: 0,

          shop:
            withShops
              ? generateEventShop(
                  event,
                  index
                )
              : [],
        },
      ]
    )
  );
}

function createBlankGame() {
  return {
    saveVersion:
      SAVE_VERSION,

    clubName: "",

    coins: 1500,
    gems: 25,
    trophies: 0,

    collection: [],

    squad: [],

    formation: {},

    market: [],

    marketCap: 25,

    trainingCap: 30,

    training: null,

    upgradePacks: {
      gen1: 0,
      gen2: 0,
      gen4: 0,
    },

    activeStage: 1,

    career: {
      stage: 1,
      match: 1,
      wins: 0,
      totalWins: 0,
      completedStages: [],
    },

    events:
      createEventStates(
        false
      ),

    daily: {
      lastClaimAt: 0,
      streak: 0,
    },

    profile: {
      playSeconds: 0,
      infoEnabled: true,

      notifications: {
        daily: true,
        training: true,
        rental: true,
      },
    },

    rentalCenter: {
      unlocked: false,
      slotsUnlocked: 0,
      rentals: [],
      pendingCoins: 0,
      lifetimeCoins: 0,
      completedRentals: 0,
    },

    coaches: {
      ownedStars: [],
      activeSessions: [],
      totalGains: 0,
    },

    stageRewardsClaimed: [],

    redeemedCoupons: [],

    storePurchases: [],

    stats: {
      transfersBought: 0,
      playersSold: 0,
      draws: 0,
    },
  };
}

function normalizeGame(
  saved
) {
  const blank =
    createBlankGame();

  if (
    !saved ||
    typeof saved !==
      "object"
  ) {
    return blank;
  }

  const events =
    createEventStates(
      true
    );

  eventConfigs.forEach(
    (event, index) => {
      const old =
        saved.events?.[
          event.id
        ];

      events[
        event.id
      ] = {
        ...events[
          event.id
        ],

        ...(old || {}),

        shop:
          Array.isArray(
            old?.shop
          ) &&
          old.shop.length
            ? old.shop
            : generateEventShop(
                event,
                index
              ),
      };
    }
  );

  const collection =
    Array.isArray(
      saved.collection
    )
      ? saved.collection.map(
          (player) => ({
            ...player,

            country:
              player.country ||
              "TR",

            positionGroup:
              player.positionGroup ||
              getPositionGroup(
                player.position
              ),

            sold:
              Boolean(
                player.sold
              ),
          })
        )
      : [];

  return {
    ...blank,
    ...saved,

    saveVersion:
      SAVE_VERSION,

    collection,

    events,

    formation:
      saved.formation ||
      {},

    upgradePacks: {
      ...blank.upgradePacks,
      ...(saved.upgradePacks ||
        {}),
    },

    career: {
      ...blank.career,
      ...(saved.career ||
        {}),
    },

    daily: {
      ...blank.daily,
      ...(saved.daily ||
        {}),
    },

    profile: {
      ...blank.profile,
      ...(saved.profile ||
        {}),

      notifications: {
        ...blank.profile
          .notifications,
        ...(saved.profile
          ?.notifications ||
          {}),
      },
    },

    rentalCenter: {
      ...blank.rentalCenter,
      ...(saved.rentalCenter ||
        {}),
    },

    coaches: {
      ...blank.coaches,
      ...(saved.coaches ||
        {}),
    },

    stats: {
      ...blank.stats,
      ...(saved.stats ||
        {}),
    },

    stageRewardsClaimed:
      Array.isArray(
        saved.stageRewardsClaimed
      )
        ? saved.stageRewardsClaimed
        : [],

    redeemedCoupons:
      Array.isArray(
        saved.redeemedCoupons
      )
        ? saved.redeemedCoupons
        : [],

    storePurchases:
      Array.isArray(
        saved.storePurchases
      )
        ? saved.storePurchases
        : [],
  };
}

function averageOverall(
  players
) {
  if (!players.length) {
    return 0;
  }

  return Math.round(
    players.reduce(
      (sum, player) =>
        sum +
        player.overall,
      0
    ) / players.length
  );
}

function calculateSellPrice(
  player
) {
  return Math.max(
    50,
    Math.floor(
      calculatePlayerPrice(
        player.overall
      ) * 0.6
    )
  );
}

function calculateSpeedUpCost(
  training,
  now
) {
  if (!training) {
    return 0;
  }

  const remaining =
    Math.max(
      0,
      training.endsAt -
        now
    );

  const blocks =
    Math.ceil(
      remaining /
        (15 *
          60 *
          1000)
    );

  return Math.max(
    100,
    blocks * 100
  );
}

function App() {
  const [
    started,
    setStarted,
  ] = useState(false);

  const [
    screen,
    setScreen,
  ] = useState("home");

  const [
    notice,
    setNotice,
  ] = useState("");

  const [
    now,
    setNow,
  ] = useState(
    Date.now()
  );

  const [
    game,
    setGame,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          SAVE_KEY
        );

      if (saved) {
        return normalizeGame(
          JSON.parse(saved)
        );
      }

      const old =
        localStorage.getItem(
          "soccer-cards-war-save-v4"
        );

      if (old) {
        return normalizeGame(
          JSON.parse(old)
        );
      }
    } catch {
      //
    }

    return createBlankGame();
  });

  const [
    clubNameInput,
    setClubNameInput,
  ] = useState("");

  const [
    customName,
    setCustomName,
  ] = useState("");

  const [
    customPosition,
    setCustomPosition,
  ] = useState("ST");

  const [
    customCountry,
    setCustomCountry,
  ] = useState("TR");

  const [
    selectedTeamPlayer,
    setSelectedTeamPlayer,
  ] = useState(null);

  const [
    selectedTrainingPlayer,
    setSelectedTrainingPlayer,
  ] = useState(null);

  const [
    activeEventId,
    setActiveEventId,
  ] = useState(
    eventConfigs[0]?.id ||
      "street25"
  );

  const [
    battle,
    setBattle,
  ] = useState(null);

  const [
    purchaseModal,
    setPurchaseModal,
  ] = useState(null);

  const [
    couponInput,
    setCouponInput,
  ] = useState("");

  const [
    installed,
    setInstalled,
  ] = useState(() =>
    Boolean(
      window.matchMedia?.(
        "(display-mode: standalone)"
      )?.matches ||
        window.navigator
          .standalone ===
          true
    )
  );

  const [
    installPrompt,
    setInstallPrompt,
  ] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(
        game
      )
    );
  }, [game]);

  useEffect(() => {
    if (
      document.getElementById(
        "scw-v2-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "scw-v2-styles";

    style.textContent =
      APP_CSS;

    document.head.appendChild(
      style
    );
  }, []);

  useEffect(() => {
    const timer =
      setInterval(() => {
        setNow(
          Date.now()
        );
      }, 1000);

    return () =>
      clearInterval(
        timer
      );
  }, []);

  useEffect(() => {
    const timer =
      setInterval(() => {
        if (
          document.visibilityState !==
          "visible"
        ) {
          return;
        }

        if (!game.clubName) {
          return;
        }

        setGame(
          (previous) => ({
            ...previous,

            profile: {
              ...previous.profile,

              playSeconds:
                (previous.profile
                  ?.playSeconds ||
                  0) + 1,
            },
          })
        );
      }, 1000);

    return () =>
      clearInterval(
        timer
      );
  }, [game.clubName]);

  useEffect(() => {
    const handlePrompt =
      (event) => {
        event.preventDefault();

        setInstallPrompt(
          event
        );
      };

    const handleInstalled =
      () => {
        setInstalled(true);
        setInstallPrompt(
          null
        );

        setNotice(
          "Soccer Cards War kuruldu."
        );
      };

    window.addEventListener(
      "beforeinstallprompt",
      handlePrompt
    );

    window.addEventListener(
      "appinstalled",
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handlePrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleInstalled
      );
    };
  }, []);

  useEffect(() => {
    if (
      !window.history.state
        ?.scw
    ) {
      window.history.replaceState(
        HOME_HISTORY,
        "",
        window.location.href
      );
    }

    const handlePop =
      (event) => {
        setBattle(null);

        const state =
          event.state;

        if (
          state?.scw &&
          state.view ===
            "screen"
        ) {
          setScreen(
            state.screen
          );
          return;
        }

        setScreen("home");
      };

    window.addEventListener(
      "popstate",
      handlePop
    );

    return () =>
      window.removeEventListener(
        "popstate",
        handlePop
      );
  }, []);

  useEffect(() => {
    if (!game.training) {
      return;
    }

    if (
      now <
      game.training.endsAt
    ) {
      return;
    }

    const training =
      game.training;

    setGame(
      (previous) => {
        const player =
          previous.collection.find(
            (item) =>
              item.id ===
              training.playerId
          );

        if (!player) {
          return {
            ...previous,
            training: null,
          };
        }

        const gain =
          Math.max(
            0,
            Math.min(
              training.gain,
              previous.trainingCap -
                player.overall
            )
          );

        return {
          ...previous,

          collection:
            previous.collection.map(
              (item) => {
                if (
                  item.id !==
                  player.id
                ) {
                  return item;
                }

                const overall =
                  Math.min(
                    99,
                    item.overall +
                      gain
                  );

                return {
                  ...item,
                  overall,
                  rarity:
                    getRarity(
                      overall
                    ),
                };
              }
            ),

          training: null,
        };
      }
    );

    if (
      game.profile
        ?.notifications
        ?.training
    ) {
      setNotice(
        "🏋️ Antrenman tamamlandı."
      );
    }
  }, [
    now,
    game.training,
    game.profile,
  ]);

  useEffect(() => {
    const finished =
      game.rentalCenter
        ?.rentals?.filter(
          (rental) =>
            !rental.finished &&
            now >=
              rental.endsAt
        ) || [];

    if (!finished.length) {
      return;
    }

    setGame(
      (previous) => {
        let added = 0;

        const rentals =
          previous.rentalCenter
            .rentals.map(
              (rental) => {
                if (
                  rental.finished ||
                  now <
                    rental.endsAt
                ) {
                  return rental;
                }

                const player =
                  previous.collection.find(
                    (item) =>
                      item.id ===
                      rental.playerId
                  );

                const income =
                  player
                    ? calculateRentalIncome(
                        player.overall,
                        rental.endsAt -
                          rental.startedAt
                      )
                    : 0;

                added += income;

                return {
                  ...rental,
                  finished: true,
                  earned: income,
                };
              }
            );

        return {
          ...previous,

          rentalCenter: {
            ...previous.rentalCenter,

            rentals,

            pendingCoins:
              previous
                .rentalCenter
                .pendingCoins +
              added,

            lifetimeCoins:
              previous
                .rentalCenter
                .lifetimeCoins +
              added,

            completedRentals:
              previous
                .rentalCenter
                .completedRentals +
              finished.length,
          },
        };
      }
    );

    if (
      game.profile
        ?.notifications
        ?.rental
    ) {
      setNotice(
        "🤝 Kiradaki oyuncuların geri döndü."
      );
    }
  }, [
    now,
    game.rentalCenter,
    game.profile,
  ]);

  useEffect(() => {
    const finished =
      game.coaches
        ?.activeSessions?.filter(
          (session) =>
            !session.finished &&
            now >=
              session.endsAt
        ) || [];

    if (!finished.length) {
      return;
    }

    setGame(
      (previous) => {
        let totalGain = 0;

        const finishedIds =
          new Set(
            finished.map(
              (item) =>
                item.id
            )
          );

        const affectedIds =
          new Set(
            finished.flatMap(
              (item) =>
                item.playerIds ||
                []
            )
          );

        const collection =
          previous.collection.map(
            (player) => {
              if (
                !affectedIds.has(
                  player.id
                )
              ) {
                return player;
              }

              if (
                player.overall >=
                previous.trainingCap
              ) {
                return player;
              }

              totalGain += 1;

              const overall =
                Math.min(
                  99,
                  previous.trainingCap,
                  player.overall +
                    1
                );

              return {
                ...player,
                overall,
                rarity:
                  getRarity(
                    overall
                  ),
              };
            }
          );

        return {
          ...previous,

          collection,

          coaches: {
            ...previous.coaches,

            totalGains:
              previous.coaches
                .totalGains +
              totalGain,

            activeSessions:
              previous.coaches
                .activeSessions.map(
                  (session) =>
                    finishedIds.has(
                      session.id
                    )
                      ? {
                          ...session,
                          finished: true,
                        }
                      : session
                ),
          },
        };
      }
    );

    setNotice(
      "⭐ Antrenör çalışması tamamlandı."
    );
  }, [
    now,
    game.coaches,
  ]);

  const activeEvent =
    getEventConfig(
      activeEventId
    ) ||
    eventConfigs[0];

  const currentEventState =
    game.events?.[
      activeEvent?.id
    ];

  const stageCap =
    eventConfigs[
      Math.max(
        0,
        game.activeStage -
          1
      )
    ]?.playCap || 99;

  const ownedPlayers =
    useMemo(
      () =>
        game.collection.filter(
          (player) =>
            !player.sold
        ),
      [game.collection]
    );

  const usablePlayers =
    useMemo(
      () =>
        getActivePlayers(
          game,
          stageCap
        ),
      [
        game,
        stageCap,
      ]
    );

  const formationPlayers =
    useMemo(() => {
      return TEAM_SLOTS.map(
        (slot) => {
          const playerId =
            game.formation?.[
              slot.id
            ];

          const player =
            game.collection.find(
              (item) =>
                item.id ===
                playerId
            );

          return {
            slot,
            player,
          };
        }
      );
    }, [
      game.formation,
      game.collection,
    ]);

  function showNotice(
    message
  ) {
    setNotice(
      message
    );
  }

  function openScreen(
    next
  ) {
    setScreen(next);

    window.history.pushState(
      {
        scw: true,
        view: "screen",
        screen: next,
      },
      "",
      window.location.href
    );
  }

  function setFolderScreen(
    next
  ) {
    setBattle(null);
    setScreen(next);

    window.history.replaceState(
      {
        scw: true,
        view: "screen",
        screen: next,
      },
      "",
      window.location.href
    );
  }

  function goHome() {
    setBattle(null);
    setScreen("home");

    window.history.replaceState(
      HOME_HISTORY,
      "",
      window.location.href
    );
  }

  function createClub() {
    const clean =
      clubNameInput.trim();

    if (!clean) {
      showNotice(
        "Kulübüne isim ver."
      );
      return;
    }

    const starters =
      generateStarterPlayers(
        10
      );

    const formation =
      buildInitialFormation(
        starters
      );

    setGame({
      ...createBlankGame(),

      clubName: clean,

      collection:
        starters,

      squad:
        starters.map(
          (player) =>
            player.id
        ),

      formation,

      market:
        generateMarketPlayers(
          6,
          25
        ),

      events:
        createEventStates(
          true
        ),
    });

    setStarted(true);
  }

  function resetGame() {
    const first =
      window.confirm(
        "Tüm ilerlemen silinecek. Devam etmek istiyor musun?"
      );

    if (!first) {
      return;
    }

    const second =
      window.confirm(
        "Bu işlem geri alınamaz. Gerçekten sıfırlamak istiyor musun?"
      );

    if (!second) {
      return;
    }

    localStorage.removeItem(
      SAVE_KEY
    );

    setGame(
      createBlankGame()
    );

    setStarted(false);
    setScreen("home");
    setBattle(null);
  }

  function autoBuildBestTeam() {
    const result =
      buildBestLineup(
        game
      );

    if (!result.success) {
      showNotice(
        result.message
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        formation:
          result.formation,

        squad:
          result.squad,
      })
    );

    setSelectedTeamPlayer(
      null
    );

    showNotice(
      result.message
    );
  }

  function placePlayer(
    slot
  ) {
    if (
      !selectedTeamPlayer
    ) {
      return;
    }

    const player =
      game.collection.find(
        (item) =>
          item.id ===
          selectedTeamPlayer
      );

    if (!player) {
      return;
    }

    if (
      player.sold ||
      isPlayerBusy(
        player,
        game
      )
    ) {
      showNotice(
        "Bu oyuncu şu anda kullanılamıyor."
      );
      return;
    }

    const group =
      player.positionGroup ||
      getPositionGroup(
        player.position
      );

    if (
      group !== slot.group
    ) {
      showNotice(
        `Bu slota sadece ${positionGroups[
          slot.group
        ].name} oyuncusu koyabilirsin.`
      );
      return;
    }

    if (
      player.overall >
        stageCap &&
      player.overall !==
        100
    ) {
      showNotice(
        `Bu aşamada maksimum ${stageCap} GEN oyuncu kullanılabilir.`
      );
      return;
    }

    setGame(
      (previous) => {
        const formation = {
          ...previous.formation,
        };

        Object.keys(
          formation
        ).forEach(
          (key) => {
            if (
              formation[key] ===
              player.id
            ) {
              delete formation[
                key
              ];
            }
          }
        );

        formation[
          slot.id
        ] = player.id;

        return {
          ...previous,
          formation,
        };
      }
    );

    setSelectedTeamPlayer(
      null
    );
  }

  function removeSlot(
    slotId
  ) {
    setGame(
      (previous) => {
        const formation = {
          ...previous.formation,
        };

        delete formation[
          slotId
        ];

        return {
          ...previous,
          formation,
        };
      }
    );
  }

  function getFormationDeck() {
    return TEAM_SLOTS.map(
      (slot) => {
        const id =
          game.formation?.[
            slot.id
          ];

        return game.collection.find(
          (player) =>
            player.id === id
        );
      }
    ).filter(Boolean);
  }

  function validateFormation() {
    const deck =
      getFormationDeck();

    const result =
      getSquadProblems(
        deck
      );

    if (
      deck.length !==
        10 ||
      !result.valid
    ) {
      return {
        valid: false,
        message:
          "Takımın 2 Forvet, 3 Orta Saha, 4 Defans ve 1 Kaleciden oluşmalı.",
      };
    }

    const busy =
      deck.find(
        (player) =>
          isPlayerBusy(
            player,
            game
          )
      );

    if (busy) {
      return {
        valid: false,
        message:
          `${busy.name} şu anda kullanılamıyor.`,
      };
    }

    return {
      valid: true,
      deck,
    };
  }

  function createBattle(
    mode
  ) {
    const formation =
      validateFormation();

    if (
      !formation.valid
    ) {
      showNotice(
        formation.message
      );
      return;
    }

    if (
      mode === "career"
    ) {
      const check =
        canStartCareer(
          game,
          stageCap
        );

      if (!check.allowed) {
        showNotice(
          check.message
        );
        return;
      }
    }

    if (
      mode === "event"
    ) {
      const check =
        canStartEvent(
          game,
          stageCap
        );

      if (!check.allowed) {
        showNotice(
          check.message
        );
        return;
      }

      const cooldown =
        getEventCooldownRemaining(
          currentEventState,
          Date.now()
        );

      if (
        cooldown > 0
      ) {
        showNotice(
          `Sonraki maça ${millisecondsToClock(
            cooldown
          )} kaldı.`
        );
        return;
      }
    }

    const deck =
      formation.deck;

    const stage =
      game.activeStage;

    const target =
      mode === "career"
        ? Math.min(
            99,
            12 +
              stage * 7 +
              game.career
                .match
          )
        : Math.min(
            99,
            activeEvent.min +
              Math.floor(
                (activeEvent.max -
                  activeEvent.min) *
                  ((currentEventState
                    .match -
                    1) /
                    Math.max(
                      1,
                      activeEvent
                        .matches -
                        1
                    ))
              )
          );

    const opponentDeck =
      generateOpponentDeck(
        target,
        10
      );

    const groupOrder =
      createRandomFiveRounds();

    setBattle({
      mode,

      eventId:
        mode === "event"
          ? activeEvent.id
          : null,

      stage,

      match:
        mode === "career"
          ? game.career.match
          : currentEventState
              .match,

      playerDeck:
        deck,

      opponentDeck,

      groupOrder,

      round: 0,

      playerScore: 0,

      opponentScore: 0,

      usedPlayerIds: [],

      usedOpponentIds: [],

      history: [],

      reveal: null,

      phase: "playing",

      result: null,
    });
  }

  function chooseBattlePlayer(
    player
  ) {
    if (
      !battle ||
      battle.phase !==
        "playing"
    ) {
      return;
    }

    const group =
      battle.groupOrder[
        battle.round
      ];

    const availablePlayers =
      getAvailablePlayersForRound(
        battle.playerDeck,
        group,
        battle.usedPlayerIds
      );

    if (
      !availablePlayers.some(
        (item) =>
          item.id ===
          player.id
      )
    ) {
      showNotice(
        `Bu turda sadece kullanılmamış ${getRoundLabel(
          group
        )} oyuncusu seçebilirsin.`
      );
      return;
    }

    const opponent =
      chooseOpponentForRound(
        battle.opponentDeck,
        group,
        battle.usedOpponentIds
      );

    if (!opponent) {
      showNotice(
        "Rakip için uygun kart bulunamadı."
      );
      return;
    }

    const roundResult =
      calculateRoundResult(
        player,
        opponent
      );

    let playerScore =
      battle.playerScore;

    let opponentScore =
      battle.opponentScore;

    if (
      roundResult ===
      "win"
    ) {
      playerScore += 1;
    }

    if (
      roundResult ===
      "loss"
    ) {
      opponentScore += 1;
    }

    const nextRound =
      battle.round + 1;

    const finished =
      nextRound >= 5;

    const historyItem = {
      group,
      player,
      opponent,
      result:
        roundResult,
    };

    setBattle({
      ...battle,

      playerScore,

      opponentScore,

      round:
        nextRound,

      usedPlayerIds: [
        ...battle.usedPlayerIds,
        player.id,
      ],

      usedOpponentIds: [
        ...battle.usedOpponentIds,
        opponent.id,
      ],

      history: [
        ...battle.history,
        historyItem,
      ],

      reveal: historyItem,

      phase:
        finished
          ? "result-ready"
          : "playing",
    });
  }

  function settleBattle() {
    if (
      !battle ||
      battle.phase !==
        "result-ready"
    ) {
      return;
    }

    const win =
      battle.playerScore >
      battle.opponentScore;

    const draw =
      battle.playerScore ===
      battle.opponentScore;

    if (
      battle.mode ===
      "event"
    ) {
      settleEventBattle(
        win,
        draw
      );
      return;
    }

    settleCareerBattle(
      win,
      draw
    );
  }

  function settleEventBattle(
    win,
    draw
  ) {
    const event =
      getEventConfig(
        battle.eventId
      );

    const state =
      game.events[
        battle.eventId
      ];

    const coinReward =
      event.rewardBase +
      state.match *
        event.rewardStep;

    const eventCurrencyReward =
      calculateEventCurrencyReward(
        event,
        state.match
      );

    if (draw) {
      setGame(
        (previous) => ({
          ...previous,

          coins:
            previous.coins +
            Math.floor(
              coinReward / 2
            ),

          events: {
            ...previous.events,

            [event.id]: {
              ...previous.events[
                event.id
              ],

              nextMatchAt:
                Date.now() +
                EVENT_MATCH_COOLDOWN_MS,
            },
          },

          stats: {
            ...previous.stats,

            draws:
              previous.stats
                .draws + 1,
          },
        })
      );

      setBattle({
        ...battle,

        phase: "finished",

        result: {
          type: "draw",

          coinReward:
            Math.floor(
              coinReward / 2
            ),
        },
      });

      return;
    }

    if (!win) {
      setGame(
        (previous) => ({
          ...previous,

          events: {
            ...previous.events,

            [event.id]: {
              ...previous.events[
                event.id
              ],

              nextMatchAt:
                Date.now() +
                EVENT_MATCH_COOLDOWN_MS,
            },
          },
        })
      );

      setBattle({
        ...battle,

        phase: "finished",

        result: {
          type: "loss",
        },
      });

      return;
    }

    const packType =
      getUpgradePackReward(
        state.match,
        event.matches
      );

    const choices =
      generateRewardChoices(
        event,
        3
      );

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          coinReward,

        upgradePacks: {
          ...previous.upgradePacks,

          [packType]:
            previous
              .upgradePacks[
                packType
              ] + 1,
        },

        events: {
          ...previous.events,

          [event.id]: {
            ...previous.events[
              event.id
            ],

            wins:
              previous.events[
                event.id
              ].wins + 1,

            currency:
              previous.events[
                event.id
              ].currency +
              eventCurrencyReward,

            nextMatchAt:
              Date.now() +
              EVENT_MATCH_COOLDOWN_MS,
          },
        },
      })
    );

    setBattle({
      ...battle,

      phase:
        "reward-select",

      rewardChoices:
        choices,

      rewardContext: {
        coinReward,
        packType,
        eventCurrencyReward,
        eventCurrencyIcon:
          event.currencyIcon,
        eventCurrencyName:
          event.currencyName,
      },
    });
  }

  function settleCareerBattle(
    win,
    draw
  ) {
    const coinReward =
      150 +
      game.activeStage *
        70 +
      game.career.match *
        20;

    if (draw) {
      setGame(
        (previous) => ({
          ...previous,

          coins:
            previous.coins +
            Math.floor(
              coinReward / 2
            ),

          stats: {
            ...previous.stats,

            draws:
              previous.stats
                .draws + 1,
          },
        })
      );

      setBattle({
        ...battle,

        phase: "finished",

        result: {
          type: "draw",

          coinReward:
            Math.floor(
              coinReward / 2
            ),
        },
      });

      return;
    }

    if (!win) {
      const safeCandidates =
        battle.playerDeck.filter(
          (player) => {
            if (
              player.unsellable
            ) {
              return false;
            }

            const copy =
              game.collection.filter(
                (item) =>
                  !item.sold &&
                  item.id !==
                    player.id
              );

            return getSquadProblems(
              copy
            ).valid;
          }
        );

      if (
        safeCandidates.length
      ) {
        setBattle({
          ...battle,

          phase:
            "loss-select",

          lossCandidates:
            safeCandidates,
        });
      } else {
        setBattle({
          ...battle,

          phase: "finished",

          result: {
            type: "loss",
            protected: true,
          },
        });
      }

      return;
    }

    const choices =
      shuffle(
        battle.opponentDeck
      ).slice(0, 3);

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          coinReward,

        trophies:
          previous.trophies +
          1,

        career: {
          ...previous.career,

          totalWins:
            previous.career
              .totalWins + 1,

          wins:
            previous.career
              .wins + 1,
        },
      })
    );

    setBattle({
      ...battle,

      phase:
        "career-reward-select",

      rewardChoices:
        choices,

      rewardContext: {
        coinReward,
      },
    });
  }

  function claimRewardChoice(
    player
  ) {
    if (!battle) {
      return;
    }

    const isEvent =
      battle.phase ===
      "reward-select";

    const isCareer =
      battle.phase ===
      "career-reward-select";

    if (
      !isEvent &&
      !isCareer
    ) {
      return;
    }

    setGame(
      (previous) => {
        const next = {
          ...previous,

          collection: [
            ...previous.collection,

            {
              ...player,

              id:
                crypto.randomUUID?.() ||
                `${Date.now()}-${Math.random()}`,
            },
          ],
        };

        if (isEvent) {
          const event =
            getEventConfig(
              battle.eventId
            );

          const oldState =
            previous.events[
              event.id
            ];

          const finalMatch =
            oldState.match >=
            event.matches;

          next.events = {
            ...previous.events,

            [event.id]: {
              ...oldState,

              completed:
                finalMatch,

              match:
                finalMatch
                  ? oldState.match
                  : oldState.match +
                    1,
            },
          };

          if (finalMatch) {
            next.stageRewardsClaimed =
              [
                ...previous.stageRewardsClaimed,
              ];

            if (
              !next.stageRewardsClaimed.includes(
                event.stage
              )
            ) {
              const special =
                createStageRewardPlayer(
                  event.stage
                );

              if (special) {
                next.collection = [
                  ...next.collection,
                  special,
                ];

                next.stageRewardsClaimed.push(
                  event.stage
                );
              }
            }
          }
        }

        if (isCareer) {
          const nextMatch =
            previous.career
              .match + 1;

          const stageFinished =
            nextMatch > 10;

          next.career = {
            ...previous.career,

            match:
              stageFinished
                ? 10
                : nextMatch,

            completedStages:
              stageFinished &&
              !previous.career.completedStages.includes(
                previous.activeStage
              )
                ? [
                    ...previous
                      .career
                      .completedStages,
                    previous.activeStage,
                  ]
                : previous.career
                    .completedStages,
          };
        }

        return next;
      }
    );

    setBattle({
      ...battle,

      phase: "finished",

      result: {
        type: "win",

        rewardPlayer:
          player,

        ...battle.rewardContext,
      },
    });
  }

  useEffect(() => {
    const stage =
      game.activeStage;

    if (stage >= 10) {
      return;
    }

    const event =
      eventConfigs[
        stage - 1
      ];

    const eventDone =
      game.events[
        event.id
      ]?.completed;

    const careerDone =
      game.career
        .completedStages.includes(
          stage
        );

    if (
      !eventDone ||
      !careerDone
    ) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        activeStage:
          Math.min(
            10,
            previous.activeStage +
              1
          ),

        career: {
          ...previous.career,

          stage:
            Math.min(
              10,
              previous.career
                .stage + 1
            ),

          match: 1,

          wins: 0,
        },

        marketCap:
          event.unlockCap,

        trainingCap:
          event.unlockCap,

        market:
          generateMarketPlayers(
            6,
            event.unlockCap
          ),
      })
    );

    showNotice(
      `🔥 Aşama ${
        stage + 1
      } açıldı!`
    );
  }, [
    game.activeStage,
    game.events,
    game.career
      .completedStages,
  ]);

  function loseCareerPlayer(
    player
  ) {
    if (
      battle?.phase !==
      "loss-select"
    ) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        collection:
          previous.collection.map(
            (item) =>
              item.id ===
              player.id
                ? {
                    ...item,
                    sold: true,
                    lost: true,
                  }
                : item
          ),

        formation:
          Object.fromEntries(
            Object.entries(
              previous.formation
            ).filter(
              ([, id]) =>
                id !==
                player.id
            )
          ),
      })
    );

    setBattle({
      ...battle,

      phase: "finished",

      result: {
        type: "loss",

        lostPlayer:
          player,
      },
    });
  }

  function finishTrainingNow() {
    if (!game.training) {
      return;
    }

    const cost =
      calculateSpeedUpCost(
        game.training,
        now
      );

    if (
      game.coins < cost
    ) {
      showNotice(
        "Yeterli Coin yok."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          cost,

        training: {
          ...previous.training,

          endsAt:
            Date.now(),
        },
      })
    );
  }

  function startTraining(
    plan,
    payWithPack = false
  ) {
    const player =
      game.collection.find(
        (item) =>
          item.id ===
          selectedTrainingPlayer
      );

    if (!player) {
      showNotice(
        "Önce oyuncu seç."
      );
      return;
    }

    const check =
      canSendToTraining(
        game,
        player
      );

    if (!check.allowed) {
      showNotice(
        check.message
      );
      return;
    }

    if (
      player.overall >=
      game.trainingCap
    ) {
      showNotice(
        `Bu aşamada antrenman sınırı ${game.trainingCap} GEN.`
      );
      return;
    }

    if (game.training) {
      showNotice(
        "Zaten devam eden bir antrenman var."
      );
      return;
    }

    const cost =
      calculateTrainingCost(
        plan,
        player.overall
      );

    if (payWithPack) {
      if (
        game.upgradePacks[
          plan.packType
        ] <= 0
      ) {
        showNotice(
          "Bu GEN paketinden yok."
        );
        return;
      }
    } else if (
      game.coins < cost
    ) {
      showNotice(
        "Yeterli Coin yok."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          payWithPack
            ? previous.coins
            : previous.coins -
              cost,

        upgradePacks:
          payWithPack
            ? {
                ...previous.upgradePacks,

                [plan.packType]:
                  previous
                    .upgradePacks[
                      plan.packType
                    ] - 1,
              }
            : previous.upgradePacks,

        training: {
          playerId:
            player.id,

          gain:
            plan.gain,

          startedAt:
            Date.now(),

          endsAt:
            Date.now() +
            plan.hours *
              60 *
              60 *
              1000,
        },
      })
    );

    setSelectedTrainingPlayer(
      null
    );
  }

  function buyCoach(
    config
  ) {
    if (
      game.coaches.ownedStars.includes(
        config.stars
      )
    ) {
      return;
    }

    if (
      game.coins <
      config.price
    ) {
      showNotice(
        "Yeterli Coin yok."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          config.price,

        coaches: {
          ...previous.coaches,

          ownedStars: [
            ...previous.coaches
              .ownedStars,
            config.stars,
          ],
        },
      })
    );
  }

  function startCoachSession(
    config
  ) {
    if (
      !game.coaches.ownedStars.includes(
        config.stars
      )
    ) {
      return;
    }

    const current =
      game.coaches.activeSessions.find(
        (session) =>
          session.stars ===
            config.stars &&
          !session.finished &&
          session.endsAt >
            now
      );

    if (current) {
      showNotice(
        "Bu antrenör şu anda çalışıyor."
      );
      return;
    }

    const candidates =
      usablePlayers.filter(
        (player) =>
          player.overall <
            game.trainingCap &&
          !isPlayerBusy(
            player,
            game
          )
      );

    const safe =
      candidates.filter(
        (player) =>
          canSendToTraining(
            game,
            player
          ).allowed
      );

    const selected =
      safe.slice(
        0,
        config.slots
      );

    if (
      selected.length <
      config.slots
    ) {
      showNotice(
        `Bu antrenör için ${config.slots} uygun oyuncu gerekiyor.`
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coaches: {
          ...previous.coaches,

          activeSessions: [
            ...previous.coaches
              .activeSessions,

            {
              id:
                crypto.randomUUID?.() ||
                `${Date.now()}-${Math.random()}`,

              stars:
                config.stars,

              playerIds:
                selected.map(
                  (player) =>
                    player.id
                ),

              startedAt:
                Date.now(),

              endsAt:
                Date.now() +
                config.minutes *
                  60 *
                  1000,

              finished: false,
            },
          ],
        },
      })
    );

    showNotice(
      `${config.name} çalışmaya başladı.`
    );
  }

  function unlockRentalCenter() {
    if (
      game.rentalCenter
        .unlocked
    ) {
      return;
    }

    if (
      game.coins <
      rentalCenterConfig
        .unlockPrice
    ) {
      showNotice(
        "Yeterli Coin yok."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          rentalCenterConfig
            .unlockPrice,

        rentalCenter: {
          ...previous.rentalCenter,

          unlocked: true,
        },
      })
    );
  }

  function unlockRentalSlot() {
    const index =
      game.rentalCenter
        .slotsUnlocked;

    const price =
      rentalCenterConfig
        .slotPrices[
          index
        ];

    if (
      price ===
      undefined
    ) {
      return;
    }

    if (
      game.coins < price
    ) {
      showNotice(
        "Yeterli Coin yok."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          price,

        rentalCenter: {
          ...previous.rentalCenter,

          slotsUnlocked:
            previous
              .rentalCenter
              .slotsUnlocked +
            1,
        },
      })
    );
  }

  function rentPlayer(
    player
  ) {
    const check =
      canRentPlayer(
        game,
        player
      );

    if (!check.allowed) {
      showNotice(
        check.message
      );
      return;
    }

    const activeRentals =
      game.rentalCenter.rentals.filter(
        (rental) =>
          !rental.finished &&
          rental.endsAt >
            now
      );

    if (
      activeRentals.length >=
      game.rentalCenter
        .slotsUnlocked
    ) {
      showNotice(
        "Boş kiralama slotun yok."
      );
      return;
    }

    const start =
      Date.now();

    setGame(
      (previous) => ({
        ...previous,

        rentalCenter: {
          ...previous.rentalCenter,

          rentals: [
            ...previous
              .rentalCenter
              .rentals,

            {
              id:
                crypto.randomUUID?.() ||
                `${Date.now()}-${Math.random()}`,

              playerId:
                player.id,

              startedAt:
                start,

              endsAt:
                start +
                rentalCenterConfig
                  .maxHours *
                  60 *
                  60 *
                  1000,

              finished: false,
              earned: 0,
            },
          ],
        },
      })
    );
  }

  function recallRental(
    rental
  ) {
    if (rental.finished) {
      return;
    }

    const player =
      game.collection.find(
        (item) =>
          item.id ===
          rental.playerId
      );

    const income =
      player
        ? calculateRentalIncome(
            player.overall,
            Date.now() -
              rental.startedAt
          )
        : 0;

    setGame(
      (previous) => ({
        ...previous,

        rentalCenter: {
          ...previous.rentalCenter,

          pendingCoins:
            previous
              .rentalCenter
              .pendingCoins +
            income,

          lifetimeCoins:
            previous
              .rentalCenter
              .lifetimeCoins +
            income,

          completedRentals:
            previous
              .rentalCenter
              .completedRentals +
            1,

          rentals:
            previous
              .rentalCenter
              .rentals.map(
                (item) =>
                  item.id ===
                  rental.id
                    ? {
                        ...item,
                        finished: true,
                        earned:
                          income,
                      }
                    : item
              ),
        },
      })
    );
  }

  function collectRentalMoney() {
    const amount =
      game.rentalCenter
        .pendingCoins;

    if (
      amount <= 0
    ) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          amount,

        rentalCenter: {
          ...previous.rentalCenter,

          pendingCoins: 0,
        },
      })
    );

    showNotice(
      `🪙 ${amount.toLocaleString()} Coin toplandı.`
    );
  }

  function confirmBuyMarket(
    player
  ) {
    setPurchaseModal({
      type: "market",
      player,
    });
  }

  function confirmBuyEvent(
    player,
    eventId
  ) {
    setPurchaseModal({
      type: "event",
      player,
      eventId,
    });
  }

  function executePurchase() {
    if (!purchaseModal) {
      return;
    }

    const {
      type,
      player,
      eventId,
    } =
      purchaseModal;

    if (
      type === "market"
    ) {
      if (
        game.coins <
        player.price
      ) {
        showNotice(
          "Yeterli Coin yok."
        );

        setPurchaseModal(
          null
        );

        return;
      }

      setGame(
        (previous) => ({
          ...previous,

          coins:
            previous.coins -
            player.price,

          collection: [
            ...previous.collection,

            {
              ...player,
              price: undefined,
            },
          ],

          market:
            previous.market.filter(
              (item) =>
                item.id !==
                player.id
            ),

          stats: {
            ...previous.stats,

            transfersBought:
              previous.stats
                .transfersBought +
              1,
          },
        })
      );
    }

    if (
      type === "event"
    ) {
      const event =
        getEventConfig(
          eventId
        );

      const state =
        game.events[
          eventId
        ];

      if (
        state.currency <
        player.eventPrice
      ) {
        showNotice(
          `Yeterli ${event.currencyName} yok.`
        );

        setPurchaseModal(
          null
        );

        return;
      }

      setGame(
        (previous) => ({
          ...previous,

          collection: [
            ...previous.collection,

            {
              ...player,

              eventPrice:
                undefined,
            },
          ],

          events: {
            ...previous.events,

            [eventId]: {
              ...previous.events[
                eventId
              ],

              currency:
                previous.events[
                  eventId
                ].currency -
                player.eventPrice,

              shop:
                previous.events[
                  eventId
                ].shop.filter(
                  (item) =>
                    item.id !==
                    player.id
                ),
            },
          },
        })
      );
    }

    setPurchaseModal(
      null
    );
  }

  function sellPlayer(
    player
  ) {
    const check =
      canSellPlayer(
        game,
        player
      );

    if (!check.allowed) {
      showNotice(
        check.message
      );
      return;
    }

    const price =
      calculateSellPrice(
        player
      );

    const confirmed =
      window.confirm(
        `${player.name} ${price.toLocaleString()} Coin karşılığında satılsın mı?`
      );

    if (!confirmed) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          price,

        collection:
          previous.collection.map(
            (item) =>
              item.id ===
              player.id
                ? {
                    ...item,
                    sold: true,
                  }
                : item
          ),

        formation:
          Object.fromEntries(
            Object.entries(
              previous.formation
            ).filter(
              ([, id]) =>
                id !==
                player.id
            )
          ),

        stats: {
          ...previous.stats,

          playersSold:
            previous.stats
              .playersSold +
            1,
        },
      })
    );
  }

  function refreshMarket() {
    if (
      game.coins < 100
    ) {
      showNotice(
        "Market yenilemek için 100 Coin gerekli."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          100,

        market:
          generateMarketPlayers(
            6,
            previous.marketCap
          ),
      })
    );
  }

  function createMyPlayer() {
    if (
      game.coins < 750
    ) {
      showNotice(
        "Özel oyuncu için 750 Coin gerekli."
      );
      return;
    }

    if (
      !customName.trim()
    ) {
      showNotice(
        "Oyuncunun adını yaz."
      );
      return;
    }

    const player =
      createCustomPlayer(
        customName,
        customPosition,
        customCountry
      );

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins -
          750,

        collection: [
          ...previous.collection,
          player,
        ],
      })
    );

    setCustomName("");
  }

  function claimDaily() {
    if (
      !isDailyRewardReady(
        game,
        now
      )
    ) {
      return;
    }

    const nextStreak =
      Math.min(
        7,
        (game.daily
          ?.streak ||
          0) + 1
      );

    const amounts = [
      300,
      400,
      500,
      650,
      800,
      1000,
    ];

    if (
      nextStreak === 7
    ) {
      const player =
        generateMarketPlayers(
          1,
          Math.min(
            99,
            game.marketCap
          )
        )[0];

      setGame(
        (previous) => ({
          ...previous,

          collection: [
            ...previous.collection,

            {
              ...player,
              price: undefined,
            },
          ],

          daily: {
            lastClaimAt:
              Date.now(),

            streak:
              nextStreak,
          },
        })
      );
    } else {
      const reward =
        amounts[
          nextStreak -
            1
        ];

      setGame(
        (previous) => ({
          ...previous,

          coins:
            previous.coins +
            reward,

          daily: {
            lastClaimAt:
              Date.now(),

            streak:
              nextStreak,
          },
        })
      );
    }
  }

  function redeemCoupon() {
    const code =
      couponInput
        .trim()
        .toUpperCase();

    if (
      code !== "SAMSUN"
    ) {
      showNotice(
        "Geçersiz kod."
      );
      return;
    }

    if (
      game.redeemedCoupons.includes(
        code
      )
    ) {
      showNotice(
        "Bu kod daha önce kullanıldı."
      );
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          100000,

        redeemedCoupons: [
          ...previous.redeemedCoupons,
          code,
        ],
      })
    );

    setCouponInput("");

    showNotice(
      "Test için 100.000 Coin eklendi."
    );
  }

  async function installApp() {
    if (installed) {
      showNotice(
        "Uygulama zaten bu cihazda kurulu."
      );
      return;
    }

    if (!installPrompt) {
      showNotice(
        "Kurulum seçeneği şu anda tarayıcı tarafından sunulmuyor."
      );
      return;
    }

    await installPrompt.prompt();

    await installPrompt
      .userChoice;

    setInstallPrompt(
      null
    );
  }

  function buyTestCoins(
    pack
  ) {
    if (!STORE_TEST_MODE) {
      return;
    }

    setGame(
      (previous) => ({
        ...previous,

        coins:
          previous.coins +
          pack.coins,

        storePurchases: [
          ...previous.storePurchases,

          {
            id:
              pack.id,

            at:
              Date.now(),
          },
        ],
      })
    );
  }

  function toggleInfo() {
    setGame(
      (previous) => ({
        ...previous,

        profile: {
          ...previous.profile,

          infoEnabled:
            !previous.profile
              .infoEnabled,
        },
      })
    );
  }

  function toggleNotification(
    key
  ) {
    setGame(
      (previous) => ({
        ...previous,

        profile: {
          ...previous.profile,

          notifications: {
            ...previous.profile
              .notifications,

            [key]:
              !previous
                .profile
                .notifications[
                  key
                ],
          },
        },
      })
    );
  }

  function TopBar() {
    return (
      <header className="top-bar">
        <button
          type="button"
          className="club-button"
          onClick={goHome}
        >
          <img
            src={`${
              import.meta.env
                .BASE_URL
            }icons/icon.svg`}
            alt="SCW"
          />

          <div>
            <div className="club-name">
              {game.clubName}
            </div>

            <div className="club-sub">
              AŞAMA{" "}
              {game.activeStage}
            </div>
          </div>
        </button>

        <div className="top-right">
          <div className="currency">
            🪙{" "}
            {game.coins.toLocaleString()}
          </div>

          <div className="currency">
            💎{" "}
            {game.gems}
          </div>

          <div className="currency">
            🏆{" "}
            {game.trophies}
          </div>

          <button
            type="button"
            className="profile-small-button"
            onClick={() =>
              openScreen(
                "profile"
              )
            }
          >
            👤
          </button>
        </div>
      </header>
    );
  }

  function InfoBox({
    children,
  }) {
    if (
      !game.profile
        ?.infoEnabled
    ) {
      return null;
    }

    return (
      <div className="info-box">
        ℹ️ {children}
      </div>
    );
  }

  function PageHeader({
    title,
    subtitle,
    backTo = "home",
  }) {
    return (
      <div className="section-head">
        <div>
          <h1 className="section-title">
            {title}
          </h1>

          {subtitle && (
            <p className="section-subtitle">
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => {
            if (
              backTo ===
              "home"
            ) {
              goHome();
            } else {
              setFolderScreen(
                backTo
              );
            }
          }}
        >
          GERİ
        </button>
      </div>
    );
  }

  function HomeScreen() {
    const dailyRemaining =
      getDailyRewardRemaining(
        game,
        now
      );

    return (
      <div className="page-card">
        <div className="section-head">
          <div>
            <h1 className="section-title">
              {game.clubName}
            </h1>

            <p className="section-subtitle">
              Aşama{" "}
              {game.activeStage} •
              Kadro GEN{" "}
              {averageOverall(
                getFormationDeck()
              )}
            </p>
          </div>
        </div>

        {dailyRemaining >
        0 ? (
          <div className="notice">
            🎁 Sonraki günlük
            ödül:{" "}
            {millisecondsToClock(
              dailyRemaining
            )}
          </div>
        ) : (
          <button
            type="button"
            className="gold-button"
            style={{
              width: "100%",
              marginBottom: 12,
            }}
            onClick={
              claimDaily
            }
          >
            🎁 GÜNLÜK ÖDÜLÜ AL
          </button>
        )}

        <div className="menu-grid">
          <button
            type="button"
            className="menu-card folder-match"
            onClick={() =>
              openScreen(
                "match-menu"
              )
            }
          >
            <div className="menu-icon">
              ⚽
            </div>

            <strong>
              MAÇ
            </strong>

            <span>
              Kariyer ve etkinlik
            </span>
          </button>

          <button
            type="button"
            className="menu-card folder-team"
            onClick={() =>
              openScreen(
                "team-menu"
              )
            }
          >
            <div className="menu-icon">
              👥
            </div>

            <strong>
              TAKIMIM
            </strong>

            <span>
              Kadro, antrenman,
              koleksiyon ve
              antrenörler
            </span>
          </button>

          <button
            type="button"
            className="menu-card folder-shopping"
            onClick={() =>
              openScreen(
                "shopping-menu"
              )
            }
          >
            <div className="menu-icon">
              🛒
            </div>

            <strong>
              ALIŞVERİŞ
            </strong>

            <span>
              Mağaza, transfer,
              kiralama
            </span>
          </button>
        </div>
      </div>
    );
  }

  function MatchMenuScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="⚽ MAÇ"
          subtitle="Maç modunu seç."
        />

        <div className="folder-grid">
          <button
            type="button"
            className="folder-card folder-career"
            onClick={() =>
              openScreen(
                "career"
              )
            }
          >
            <div className="menu-icon">
              🔥
            </div>

            <strong>
              KARİYER MAÇI
            </strong>
          </button>

          <button
            type="button"
            className="folder-card folder-event"
            onClick={() =>
              openScreen(
                "events"
              )
            }
          >
            <div className="menu-icon">
              🔵
            </div>

            <strong>
              ETKİNLİK MAÇI
            </strong>
          </button>
        </div>
      </div>
    );
  }

  function TeamMenuScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="👥 TAKIMIM"
        />

        <div className="folder-grid">
          <button
            type="button"
            className="folder-card folder-team"
            onClick={() =>
              openScreen(
                "team"
              )
            }
          >
            <div className="menu-icon">
              🟩
            </div>

            <strong>
              KADRO
            </strong>
          </button>

          <button
            type="button"
            className="folder-card folder-training"
            onClick={() =>
              openScreen(
                "training"
              )
            }
          >
            <div className="menu-icon">
              🏋️
            </div>

            <strong>
              ANTRENMAN
            </strong>
          </button>

          <button
            type="button"
            className="folder-card"
            onClick={() =>
              openScreen(
                "collection"
              )
            }
          >
            <div className="menu-icon">
              🃏
            </div>

            <strong>
              KOLEKSİYON
            </strong>
          </button>

          <button
            type="button"
            className="folder-card"
            onClick={() =>
              openScreen(
                "coaches"
              )
            }
          >
            <div className="menu-icon">
              ⭐
            </div>

            <strong>
              ANTRENÖRLER
            </strong>
          </button>
        </div>
      </div>
    );
  }

  function ShoppingMenuScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="🛒 ALIŞVERİŞ"
        />

        <div className="folder-grid">
          <button
            type="button"
            className="folder-card folder-shopping"
            onClick={() =>
              openScreen(
                "store"
              )
            }
          >
            <div className="menu-icon">
              🪙
            </div>

            <strong>
              MAĞAZA
            </strong>
          </button>

          <button
            type="button"
            className="folder-card folder-transfer"
            onClick={() =>
              openScreen(
                "transfers"
              )
            }
          >
            <div className="menu-icon">
              💰
            </div>

            <strong>
              TRANSFER
            </strong>
          </button>

          <button
            type="button"
            className="folder-card"
            onClick={() =>
              openScreen(
                "rental"
              )
            }
          >
            <div className="menu-icon">
              🤝
            </div>

            <strong>
              KİRALIK MERKEZİ
            </strong>
          </button>
        </div>
      </div>
    );
  }

  function TeamScreen() {
    const deck =
      getFormationDeck();

    const validation =
      getSquadProblems(
        deck
      );

    const renderSlot =
      (item) => {
        const player =
          item.player;

        return (
          <button
            type="button"
            key={
              item.slot.id
            }
            className={`squad-slot ${
              player
                ? "filled"
                : ""
            }`}
            onClick={() => {
              if (
                selectedTeamPlayer
              ) {
                placePlayer(
                  item.slot
                );
                return;
              }

              if (player) {
                removeSlot(
                  item.slot.id
                );
              }
            }}
          >
            <span className="slot-name">
              {item.slot.label}
            </span>

            {player ? (
              <>
                <span className="slot-overall">
                  {player.overall}
                </span>

                <span className="slot-player-name">
                  {getCountryFlag(
                    player.country
                  )}{" "}
                  {player.name}
                </span>

                <small>
                  {player.position}
                </small>
              </>
            ) : (
              <span className="slot-player-name">
                + OYUNCU SEÇ
              </span>
            )}
          </button>
        );
      };

    return (
      <div className="page-card">
        <PageHeader
          title="KADRO"
          subtitle="2 Forvet • 3 Orta Saha • 4 Defans • 1 Kaleci"
          backTo="team-menu"
        />

        <button
          type="button"
          className="auto-lineup-button"
          onClick={
            autoBuildBestTeam
          }
        >
          ⚡ EN İYİ KADROYU KUR
        </button>

        <div className="team-field">
          <div className="team-row two">
            {formationPlayers
              .slice(0, 2)
              .map(renderSlot)}
          </div>

          <div className="team-row three">
            {formationPlayers
              .slice(2, 5)
              .map(renderSlot)}
          </div>

          <div className="team-row four">
            {formationPlayers
              .slice(5, 9)
              .map(renderSlot)}
          </div>

          <div className="team-row one">
            {formationPlayers
              .slice(9, 10)
              .map(renderSlot)}
          </div>
        </div>

        <div className="notice">
          {validation.valid &&
          deck.length === 10
            ? `✅ Kadro hazır • Ortalama GEN ${averageOverall(
                deck
              )}`
            : "⚠️ 2 Forvet + 3 Orta Saha + 4 Defans + 1 Kaleci gerekli."}
        </div>

        <div className="player-grid">
          {ownedPlayers.map(
            (player) => {
              const busy =
                isPlayerBusy(
                  player,
                  game
                );

              const locked =
                player.overall >
                  stageCap &&
                player.overall !==
                  100;

              return (
                <PlayerCard
                  key={
                    player.id
                  }
                  player={
                    player
                  }
                  selected={
                    selectedTeamPlayer ===
                    player.id
                  }
                  locked={
                    locked
                  }
                  disabled={
                    busy ||
                    locked
                  }
                  onClick={() =>
                    setSelectedTeamPlayer(
                      player.id
                    )
                  }
                />
              );
            }
          )}
        </div>
      </div>
    );
  }

  function CollectionScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="KOLEKSİYON"
          backTo="team-menu"
        />

        <h2>
          Aşama Ödülleri
        </h2>

        <div className="stage-reward-grid">
          {stageRewards.map(
            (reward) => {
              const claimed =
                game.stageRewardsClaimed.includes(
                  reward.stage
                );

              return (
                <div
                  key={
                    reward.stage
                  }
                  className={`stage-reward-card ${
                    claimed
                      ? ""
                      : "locked"
                  }`}
                >
                  <div className="big-number">
                    {reward.overall}
                  </div>

                  <strong>
                    {getCountryFlag(
                      reward.country
                    )}{" "}
                    {reward.name}
                  </strong>

                  <p>
                    Aşama{" "}
                    {reward.stage}
                  </p>

                  <span className="status-pill">
                    {claimed
                      ? "AÇILDI"
                      : "🔒 KİLİTLİ"}
                  </span>
                </div>
              );
            }
          )}
        </div>

        <h2>
          Tüm Kartlar
        </h2>

        <div className="player-grid">
          {game.collection.map(
            (player) => (
              <PlayerCard
                key={
                  player.id
                }
                player={
                  player
                }
                sold={
                  player.sold
                }
              />
            )
          )}
        </div>
      </div>
    );
  }

  function TransfersScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="TRANSFER"
          backTo="shopping-menu"
        />

        <button
          type="button"
          className="secondary-button"
          onClick={
            refreshMarket
          }
        >
          🔄 MARKETİ YENİLE • 100
        </button>

        <h2>
          Transfer Pazarı
        </h2>

        <div className="player-grid">
          {game.market.map(
            (player) => (
              <div
                key={
                  player.id
                }
              >
                <PlayerCard
                  player={
                    player
                  }
                  price={
                    player.price
                  }
                />

                <button
                  type="button"
                  className="gold-button"
                  style={{
                    width:
                      "100%",
                    marginTop:
                      6,
                  }}
                  onClick={() =>
                    confirmBuyMarket(
                      player
                    )
                  }
                >
                  SATIN AL
                </button>
              </div>
            )
          )}
        </div>

        <h2>
          Oyuncu Sat
        </h2>

        <div className="player-grid">
          {ownedPlayers.map(
            (player) => (
              <div
                key={
                  player.id
                }
              >
                <PlayerCard
                  player={
                    player
                  }
                />

                <button
                  type="button"
                  className="danger-button"
                  style={{
                    width:
                      "100%",
                    marginTop:
                      6,
                  }}
                  onClick={() =>
                    sellPlayer(
                      player
                    )
                  }
                >
                  SAT •{" "}
                  {calculateSellPrice(
                    player
                  ).toLocaleString()}
                </button>
              </div>
            )
          )}
        </div>

        <h2>
          Kendi Oyuncunu Oluştur
        </h2>

        <div className="panel">
          <input
            className="text-input"
            value={
              customName
            }
            onChange={(event) =>
              setCustomName(
                event.target
                  .value
              )
            }
            placeholder="Oyuncu adı"
          />

          <select
            className="select-input"
            value={
              customPosition
            }
            onChange={(event) =>
              setCustomPosition(
                event.target
                  .value
              )
            }
          >
            {positions.map(
              (position) => (
                <option
                  key={
                    position
                  }
                  value={
                    position
                  }
                >
                  {position}
                </option>
              )
            )}
          </select>

          <select
            className="select-input"
            value={
              customCountry
            }
            onChange={(event) =>
              setCustomCountry(
                event.target
                  .value
              )
            }
          >
            {countries.map(
              (country) => (
                <option
                  key={
                    country.code
                  }
                  value={
                    country.code
                  }
                >
                  {country.flag}{" "}
                  {country.name}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            className="gold-button"
            onClick={
              createMyPlayer
            }
          >
            OLUŞTUR • 750 COIN
          </button>
        </div>
      </div>
    );
  }

  function TrainingScreen() {
    const currentPlayer =
      game.training
        ? game.collection.find(
            (player) =>
              player.id ===
              game.training
                .playerId
          )
        : null;

    return (
      <div className="page-card">
        <PageHeader
          title="ANTRENMAN"
          backTo="team-menu"
        />

        <div className="notice">
          📦 +1:{" "}
          {game.upgradePacks.gen1}
          {" • "}
          +2:{" "}
          {game.upgradePacks.gen2}
          {" • "}
          +4:{" "}
          {game.upgradePacks.gen4}
        </div>

        {game.training &&
        currentPlayer ? (
          <div className="panel">
            <h2>
              {currentPlayer.name}
            </h2>

            <p>
              {millisecondsToClock(
                Math.max(
                  0,
                  game.training
                    .endsAt -
                    now
                )
              )}
            </p>

            <button
              type="button"
              className="gold-button"
              onClick={
                finishTrainingNow
              }
            >
              ⚡ HEMEN BİTİR •{" "}
              {calculateSpeedUpCost(
                game.training,
                now
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="player-grid">
              {ownedPlayers.map(
                (player) => (
                  <PlayerCard
                    key={
                      player.id
                    }
                    player={
                      player
                    }
                    selected={
                      selectedTrainingPlayer ===
                      player.id
                    }
                    disabled={
                      isPlayerBusy(
                        player,
                        game
                      )
                    }
                    onClick={() =>
                      setSelectedTrainingPlayer(
                        player.id
                      )
                    }
                  />
                )
              )}
            </div>

            <div className="list-grid">
              {trainingPlans.map(
                (plan) => {
                  const player =
                    game.collection.find(
                      (item) =>
                        item.id ===
                        selectedTrainingPlayer
                    );

                  const cost =
                    player
                      ? calculateTrainingCost(
                          plan,
                          player.overall
                        )
                      : 0;

                  return (
                    <div
                      key={
                        plan.id
                      }
                      className="list-item"
                    >
                      <div>
                        <strong>
                          {plan.title}
                        </strong>

                        <p>
                          {plan.duration}
                          {" • +"}
                          {plan.gain}
                          {" GEN"}
                        </p>
                      </div>

                      <div className="action-row">
                        <button
                          type="button"
                          className="gold-button"
                          onClick={() =>
                            startTraining(
                              plan,
                              false
                            )
                          }
                        >
                          🪙 {cost}
                        </button>

                        <button
                          type="button"
                          className="green-button"
                          onClick={() =>
                            startTraining(
                              plan,
                              true
                            )
                          }
                        >
                          📦{" "}
                          {
                            game
                              .upgradePacks[
                              plan
                                .packType
                            ]
                          }
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  function CoachesScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="ANTRENÖRLER"
          backTo="team-menu"
        />

        <div className="coach-grid">
          {coachConfigs.map(
            (coach) => {
              const owned =
                game.coaches.ownedStars.includes(
                  coach.stars
                );

              const session =
                game.coaches.activeSessions.find(
                  (item) =>
                    item.stars ===
                      coach.stars &&
                    !item.finished &&
                    item.endsAt >
                      now
                );

              return (
                <div
                  key={
                    coach.stars
                  }
                  className="coach-card"
                >
                  <div>
                    {"⭐".repeat(
                      coach.stars
                    )}
                  </div>

                  <h3>
                    {coach.name}
                  </h3>

                  <p>
                    {coach.slots} oyuncu
                    {" • "}
                    {coach.minutes} dk
                  </p>

                  {session ? (
                    <div className="status-pill">
                      {millisecondsToClock(
                        session.endsAt -
                          now
                      )}
                    </div>
                  ) : owned ? (
                    <button
                      type="button"
                      className="green-button"
                      onClick={() =>
                        startCoachSession(
                          coach
                        )
                      }
                    >
                      OYUNCU GÖNDER
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="gold-button"
                      onClick={() =>
                        buyCoach(
                          coach
                        )
                      }
                    >
                      SATIN AL •{" "}
                      {coach.price.toLocaleString()}
                    </button>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  function RentalScreen() {
    if (
      !game.rentalCenter
        .unlocked
    ) {
      return (
        <div className="page-card">
          <PageHeader
            title="KİRALIK MERKEZİ"
            backTo="shopping-menu"
          />

          <button
            type="button"
            className="gold-button"
            onClick={
              unlockRentalCenter
            }
          >
            MERKEZİ AÇ • 1.000
          </button>
        </div>
      );
    }

    const activeRentals =
      game.rentalCenter.rentals.filter(
        (rental) =>
          !rental.finished &&
          rental.endsAt >
            now
      );

    const nextSlotPrice =
      rentalCenterConfig
        .slotPrices[
          game.rentalCenter
            .slotsUnlocked
        ];

    return (
      <div className="page-card">
        <PageHeader
          title="KİRALIK MERKEZİ"
          backTo="shopping-menu"
        />

        <div className="panel">
          <div className="big-number">
            🪙{" "}
            {game.rentalCenter.pendingCoins.toLocaleString()}
          </div>

          <button
            type="button"
            className="gold-button"
            onClick={
              collectRentalMoney
            }
          >
            PARAYI TOPLA
          </button>
        </div>

        {nextSlotPrice !==
          undefined && (
          <button
            type="button"
            className="blue-button"
            onClick={
              unlockRentalSlot
            }
          >
            + SLOT •{" "}
            {nextSlotPrice.toLocaleString()}
          </button>
        )}

        <div className="rental-slot-grid">
          {activeRentals.map(
            (rental) => {
              const player =
                game.collection.find(
                  (item) =>
                    item.id ===
                    rental.playerId
                );

              return (
                <div
                  key={
                    rental.id
                  }
                  className="rental-slot"
                >
                  <strong>
                    {player?.name}
                  </strong>

                  <p>
                    {millisecondsToClock(
                      rental.endsAt -
                        now
                    )}
                  </p>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      recallRental(
                        rental
                      )
                    }
                  >
                    GERİ ÇAĞIR
                  </button>
                </div>
              );
            }
          )}
        </div>

        <div className="player-grid">
          {ownedPlayers.map(
            (player) => (
              <div
                key={
                  player.id
                }
              >
                <PlayerCard
                  player={
                    player
                  }
                />

                <button
                  type="button"
                  className="blue-button"
                  onClick={() =>
                    rentPlayer(
                      player
                    )
                  }
                >
                  KİRAYA VER
                </button>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  function EventsScreen() {
    if (
      !activeEvent ||
      !currentEventState
    ) {
      return null;
    }

    const cooldown =
      getEventCooldownRemaining(
        currentEventState,
        now
      );

    return (
      <div className="page-card">
        <PageHeader
          title="ETKİNLİK MAÇI"
          backTo="match-menu"
        />

        <div className="tabs">
          {eventConfigs.map(
            (event) => {
              const unlocked =
                event.stage <=
                game.activeStage;

              return (
                <button
                  type="button"
                  key={
                    event.id
                  }
                  className={`tab-button ${
                    activeEventId ===
                    event.id
                      ? "active"
                      : ""
                  }`}
                  disabled={
                    !unlocked
                  }
                  onClick={() =>
                    setActiveEventId(
                      event.id
                    )
                  }
                >
                  {event.icon}{" "}
                  {event.name}
                </button>
              );
            }
          )}
        </div>

        <div className="panel">
          <h2>
            {activeEvent.icon}{" "}
            {activeEvent.name}
          </h2>

          <p>
            Maç{" "}
            {currentEventState.match}
            {" / "}
            {activeEvent.matches}
          </p>

          <div className="event-money">
            {activeEvent.currencyIcon}{" "}
            {currentEventState.currency.toLocaleString()}{" "}
            {activeEvent.currencyName}
          </div>

          {cooldown > 0 ? (
            <button
              type="button"
              className="secondary-button"
              disabled
            >
              SONRAKİ MAÇ{" "}
              {millisecondsToClock(
                cooldown
              )}
            </button>
          ) : (
            <button
              type="button"
              className="blue-button"
              onClick={() =>
                createBattle(
                  "event"
                )
              }
            >
              MAÇA GİR
            </button>
          )}
        </div>

        <h2>
          Etkinlik Mağazası
        </h2>

        <div className="player-grid">
          {currentEventState.shop.map(
            (player) => (
              <div
                key={
                  player.id
                }
              >
                <PlayerCard
                  player={
                    player
                  }
                  price={
                    player.eventPrice
                  }
                  currencyIcon={
                    activeEvent.currencyIcon
                  }
                />

                <button
                  type="button"
                  className="blue-button"
                  onClick={() =>
                    confirmBuyEvent(
                      player,
                      activeEvent.id
                    )
                  }
                >
                  SATIN AL
                </button>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  function CareerScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="🔥 KARİYER MAÇI"
          backTo="match-menu"
        />

        <div className="panel">
          <p>
            Aşama{" "}
            {game.activeStage}
            {" • Maç "}
            {game.career.match}
            /10
          </p>

          <button
            type="button"
            className="danger-button"
            onClick={() =>
              createBattle(
                "career"
              )
            }
          >
            MAÇA GİR
          </button>
        </div>
      </div>
    );
  }

  function BattleScreen() {
    if (!battle) {
      return null;
    }

    if (
      battle.phase ===
        "reward-select" ||
      battle.phase ===
        "career-reward-select"
    ) {
      return (
        <div className="page-card">
          <h1 className="section-title">
            🎁 KARTINI SEÇ
          </h1>

          {battle.rewardContext
            ?.eventCurrencyReward && (
            <div className="event-money">
              {
                battle
                  .rewardContext
                  .eventCurrencyIcon
              }{" "}
              +
              {
                battle
                  .rewardContext
                  .eventCurrencyReward
              }{" "}
              {
                battle
                  .rewardContext
                  .eventCurrencyName
              }
            </div>
          )}

          <div className="reward-grid">
            {battle.rewardChoices.map(
              (player) => (
                <button
                  type="button"
                  key={
                    player.id
                  }
                  className="reward-card-back"
                  onClick={() =>
                    claimRewardChoice(
                      player
                    )
                  }
                >
                  ?
                </button>
              )
            )}
          </div>
        </div>
      );
    }

    if (
      battle.phase ===
      "loss-select"
    ) {
      return (
        <div className="page-card">
          <h1>
            KARİYER CEZASI
          </h1>

          <div className="player-grid">
            {battle.lossCandidates.map(
              (player) => (
                <PlayerCard
                  key={
                    player.id
                  }
                  player={
                    player
                  }
                  onClick={() =>
                    loseCareerPlayer(
                      player
                    )
                  }
                />
              )
            )}
          </div>
        </div>
      );
    }

    if (
      battle.phase ===
      "finished"
    ) {
      const result =
        battle.result;

      return (
        <div className="page-card">
          <h1>
            {result?.type ===
            "win"
              ? "🏆 GALİBİYET"
              : result?.type ===
                  "draw"
                ? "🤝 BERABERE"
                : "❌ MAĞLUBİYET"}
          </h1>

          {result?.eventCurrencyReward && (
            <div className="event-money">
              {
                result.eventCurrencyIcon
              }{" "}
              +
              {
                result.eventCurrencyReward
              }{" "}
              {
                result.eventCurrencyName
              }
            </div>
          )}

          {result?.rewardPlayer && (
            <div className="notice">
              🎁{" "}
              {
                result
                  .rewardPlayer
                  .name
              }{" "}
              senin oldu.
            </div>
          )}

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setBattle(null);

              setScreen(
                battle.mode ===
                  "event"
                  ? "events"
                  : "career"
              );
            }}
          >
            DEVAM ET
          </button>
        </div>
      );
    }

    const currentGroup =
      battle.groupOrder[
        Math.min(
          battle.round,
          4
        )
      ];

    const available =
      getAvailablePlayersForRound(
        battle.playerDeck,
        currentGroup,
        battle.usedPlayerIds
      );

    return (
      <div className="page-card">
        <button
          type="button"
          className="back-button"
          onClick={() =>
            setBattle(null)
          }
        >
          ← MAÇTAN ÇIK
        </button>

        <div className="battle-score">
          <div>
            <span>
              SEN
            </span>

            <strong>
              {
                battle.playerScore
              }
            </strong>
          </div>

          <b>:</b>

          <div>
            <span>
              RAKİP
            </span>

            <strong>
              {
                battle.opponentScore
              }
            </strong>
          </div>
        </div>

        <div className="round-plan">
          {battle.groupOrder.map(
            (group, index) => (
              <div
                key={`${group}-${index}`}
                className={`round-chip ${
                  index ===
                  battle.round
                    ? "active"
                    : index <
                        battle.round
                      ? "done"
                      : ""
                }`}
              >
                {index + 1}.{" "}
                {getRoundLabel(
                  group
                )}
              </div>
            )
          )}
        </div>

        {battle.phase ===
          "playing" && (
          <>
            <div className="battle-group">
              TUR{" "}
              {battle.round +
                1}
              /5 —{" "}
              {getRoundLabel(
                currentGroup
              )}
            </div>

            {battle.reveal && (
              <div className="notice">
                Önceki tur:{" "}
                {
                  battle.reveal
                    .player.name
                }{" "}
                {
                  battle.reveal
                    .player
                    .overall
                }{" "}
                GEN • Rakip{" "}
                {
                  battle.reveal
                    .opponent.name
                }{" "}
                {
                  battle.reveal
                    .opponent
                    .overall
                }{" "}
                GEN
              </div>
            )}

            <div className="battle-hand">
              {available.map(
                (player) => (
                  <PlayerCard
                    key={
                      player.id
                    }
                    player={
                      player
                    }
                    onClick={() =>
                      chooseBattlePlayer(
                        player
                      )
                    }
                  />
                )
              )}
            </div>
          </>
        )}

        {battle.phase ===
          "result-ready" && (
          <>
            <div className="notice">
              5 düello tamamlandı.
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={
                settleBattle
              }
            >
              MAÇ SONUCUNU GÖR
            </button>
          </>
        )}
      </div>
    );
  }

  function ProfileScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="PROFİL"
        />

        <div className="profile-stat-grid">
          <div className="profile-stat">
            <span>
              AKTİF OYUN SÜRESİ
            </span>

            <strong>
              {formatPlayTime(
                game.profile
                  .playSeconds
              )}
            </strong>
          </div>

          <div className="profile-stat">
            <span>
              AŞAMA
            </span>

            <strong>
              {game.activeStage}/10
            </strong>
          </div>
        </div>

        <div className="panel">
          <div className="setting-row">
            <strong>
              Bilgilendirmeler
            </strong>

            <button
              type="button"
              className={`switch-button ${
                game.profile
                  .infoEnabled
                  ? "on"
                  : ""
              }`}
              onClick={
                toggleInfo
              }
            >
              {game.profile
                .infoEnabled
                ? "AÇIK"
                : "KAPALI"}
            </button>
          </div>

          {[
            "daily",
            "training",
            "rental",
          ].map(
            (key) => (
              <div
                className="setting-row"
                key={
                  key
                }
              >
                <strong>
                  🔔 {key}
                </strong>

                <button
                  type="button"
                  className={`switch-button ${
                    game.profile
                      .notifications[
                      key
                    ]
                      ? "on"
                      : ""
                  }`}
                  onClick={() =>
                    toggleNotification(
                      key
                    )
                  }
                >
                  {game.profile
                    .notifications[
                    key
                  ]
                    ? "AÇIK"
                    : "KAPALI"}
                </button>
              </div>
            )
          )}

          <div className="setting-row">
            <strong>
              Uygulama
            </strong>

            <button
              type="button"
              className="secondary-button"
              onClick={
                installApp
              }
            >
              {installed
                ? "KURULU"
                : "YÜKLE"}
            </button>
          </div>

          <div className="setting-row">
            <strong>
              Oyunu Sıfırla
            </strong>

            <button
              type="button"
              className="danger-button"
              onClick={
                resetGame
              }
            >
              SIFIRLA
            </button>
          </div>
        </div>
      </div>
    );
  }

  function StoreScreen() {
    return (
      <div className="page-card">
        <PageHeader
          title="MAĞAZA"
          backTo="shopping-menu"
        />

        <div className="shop-grid">
          {COIN_PACKAGES.map(
            (pack) => (
              <div
                key={
                  pack.id
                }
                className="shop-card"
              >
                <div className="big-number">
                  🪙{" "}
                  {pack.coins.toLocaleString()}
                </div>

                <p>
                  {pack.price}
                </p>

                <button
                  type="button"
                  className="gold-button"
                  onClick={() =>
                    buyTestCoins(
                      pack
                    )
                  }
                >
                  TEST SATIN AL
                </button>
              </div>
            )
          )}
        </div>

        <input
          className="text-input"
          value={
            couponInput
          }
          onChange={(event) =>
            setCouponInput(
              event.target.value
            )
          }
          placeholder="Kupon"
        />

        <button
          type="button"
          className="secondary-button"
          onClick={
            redeemCoupon
          }
        >
          KODU KULLAN
        </button>
      </div>
    );
  }

  if (
    !started &&
    game.clubName
  ) {
    return (
      <div className="app-shell">
        <div className="intro-screen">
          <div className="intro-box">
            <img
              className="intro-logo"
              src={`${
                import.meta.env
                  .BASE_URL
              }icons/icon.svg`}
              alt="SCW"
            />

            <h1>
              SOCCER CARDS WAR
            </h1>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                setStarted(
                  true
                )
              }
            >
              DEVAM ET
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!game.clubName) {
    return (
      <div className="app-shell">
        <div className="setup-screen">
          <div className="setup-box page-card">
            <h1>
              KULÜBÜNÜ KUR
            </h1>

            <input
              className="text-input"
              value={
                clubNameInput
              }
              onChange={(event) =>
                setClubNameInput(
                  event.target
                    .value
                )
              }
            />

            <button
              type="button"
              className="primary-button"
              onClick={
                createClub
              }
            >
              KULÜBÜ KUR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopBar />

      {notice && (
        <button
          type="button"
          className="notice"
          style={{
            width: "100%",
          }}
          onClick={() =>
            setNotice("")
          }
        >
          {notice}
        </button>
      )}

      {battle ? (
        <BattleScreen />
      ) : (
        <>
          {screen ===
            "home" && (
            <HomeScreen />
          )}

          {screen ===
            "match-menu" && (
            <MatchMenuScreen />
          )}

          {screen ===
            "team-menu" && (
            <TeamMenuScreen />
          )}

          {screen ===
            "shopping-menu" && (
            <ShoppingMenuScreen />
          )}

          {screen ===
            "team" && (
            <TeamScreen />
          )}

          {screen ===
            "collection" && (
            <CollectionScreen />
          )}

          {screen ===
            "transfers" && (
            <TransfersScreen />
          )}

          {screen ===
            "training" && (
            <TrainingScreen />
          )}

          {screen ===
            "coaches" && (
            <CoachesScreen />
          )}

          {screen ===
            "rental" && (
            <RentalScreen />
          )}

          {screen ===
            "events" && (
            <EventsScreen />
          )}

          {screen ===
            "career" && (
            <CareerScreen />
          )}

          {screen ===
            "profile" && (
            <ProfileScreen />
          )}

          {screen ===
            "store" && (
            <StoreScreen />
          )}
        </>
      )}

      {purchaseModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>
              Oyuncu satın alınsın mı?
            </h2>

            <PlayerCard
              player={
                purchaseModal.player
              }
            />

            <div className="action-row">
              <button
                type="button"
                className="gold-button"
                onClick={
                  executePurchase
                }
              >
                SATIN AL
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setPurchaseModal(
                    null
                  )
                }
              >
                VAZGEÇ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;