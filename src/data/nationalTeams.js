export const NATIONAL_MATCH_WINS = 10;

const p = (name, position, wikiTitle = name) => ({ name, position, wikiTitle });

export const nationalTeams = [
  { code:'TR', name:'Türkiye', flag:'🇹🇷', players:[p('Hakan Çalhanoğlu','CM'),p('Arda Güler','CAM'),p('Kenan Yıldız','LW'),p('Kerem Aktürkoğlu','LW'),p('Orkun Kökçü','CM'),p('Merih Demiral','CB'),p('Abdülkerim Bardakcı','CB'),p('Ferdi Kadıoğlu','LB'),p('Mert Müldür','RB'),p('Uğurcan Çakır','GK'),p('Barış Alper Yılmaz','RW')]},
  { code:'PT', name:'Portekiz', flag:'🇵🇹', players:[p('Cristiano Ronaldo','ST'),p('Bruno Fernandes','CAM'),p('Bernardo Silva','RW'),p('Rafael Leão','LW','Rafael_Leão'),p('Vitinha','CM','Vitinha_(footballer,_born_2000)'),p('João Neves','CM'),p('Rúben Dias','CB'),p('Nuno Mendes','LB'),p('Diogo Dalot','RB'),p('Diogo Costa','GK'),p('Gonçalo Ramos','ST')]},
  { code:'AR', name:'Arjantin', flag:'🇦🇷', players:[p('Lionel Messi','RW'),p('Lautaro Martínez','ST'),p('Julián Álvarez','ST'),p('Alexis Mac Allister','CM'),p('Enzo Fernández','CM'),p('Rodrigo De Paul','CM'),p('Cristian Romero','CB'),p('Lisandro Martínez','CB'),p('Nahuel Molina','RB'),p('Nicolás Tagliafico','LB'),p('Emiliano Martínez','GK')]},
  { code:'BR', name:'Brezilya', flag:'🇧🇷', players:[p('Vinícius Júnior','LW'),p('Rodrygo','RW'),p('Raphinha','RW'),p('Bruno Guimarães','CM'),p('Lucas Paquetá','CAM'),p('Gabriel Magalhães','CB'),p('Marquinhos','CB'),p('Éder Militão','CB'),p('Wendell','LB','Wendell_(footballer,_born_1993)'),p('Alisson Becker','GK'),p('Endrick','ST')]},
  { code:'FR', name:'Fransa', flag:'🇫🇷', players:[p('Kylian Mbappé','ST'),p('Ousmane Dembélé','RW'),p('Marcus Thuram','ST'),p('Aurélien Tchouaméni','CDM'),p('Eduardo Camavinga','CM'),p('Warren Zaïre-Emery','CM'),p('William Saliba','CB'),p('Ibrahima Konaté','CB'),p('Theo Hernández','LB'),p('Jules Koundé','RB'),p('Mike Maignan','GK')]},
  { code:'ES', name:'İspanya', flag:'🇪🇸', players:[p('Lamine Yamal','RW'),p('Nico Williams','LW'),p('Dani Olmo','CAM'),p('Pedri','CM'),p('Rodri','CDM','Rodri_(footballer,_born_1996)'),p('Fabián Ruiz','CM'),p('Pau Cubarsí','CB'),p('Robin Le Normand','CB'),p('Marc Cucurella','LB'),p('Dani Carvajal','RB'),p('Unai Simón','GK')]},
  { code:'DE', name:'Almanya', flag:'🇩🇪', players:[p('Jamal Musiala','CAM'),p('Florian Wirtz','CAM'),p('Kai Havertz','ST'),p('Joshua Kimmich','CM'),p('Aleksandar Pavlović','CDM'),p('Antonio Rüdiger','CB'),p('Jonathan Tah','CB'),p('David Raum','LB'),p('Benjamin Henrichs','RB'),p('Marc-André ter Stegen','GK'),p('Niclas Füllkrug','ST')]},
  { code:'GB', name:'İngiltere', flag:'🏴', players:[p('Harry Kane','ST'),p('Jude Bellingham','CAM'),p('Bukayo Saka','RW'),p('Phil Foden','CAM'),p('Cole Palmer','CAM'),p('Declan Rice','CDM'),p('John Stones','CB'),p('Marc Guéhi','CB'),p('Trent Alexander-Arnold','RB'),p('Luke Shaw','LB'),p('Jordan Pickford','GK')]},
  { code:'IT', name:'İtalya', flag:'🇮🇹', players:[p('Gianluigi Donnarumma','GK'),p('Alessandro Bastoni','CB'),p('Riccardo Calafiori','CB'),p('Giovanni Di Lorenzo','RB'),p('Federico Dimarco','LB'),p('Nicolò Barella','CM'),p('Sandro Tonali','CM'),p('Davide Frattesi','CM'),p('Federico Chiesa','RW'),p('Giacomo Raspadori','CF'),p('Mateo Retegui','ST')]},
  { code:'NL', name:'Hollanda', flag:'🇳🇱', players:[p('Virgil van Dijk','CB'),p('Cody Gakpo','LW'),p('Xavi Simons','CAM'),p('Frenkie de Jong','CM'),p('Tijjani Reijnders','CM'),p('Denzel Dumfries','RB'),p('Nathan Aké','CB'),p('Micky van de Ven','CB'),p('Jurrien Timber','RB','Jurriën_Timber'),p('Bart Verbruggen','GK'),p('Memphis Depay','CF')]},
  { code:'HR', name:'Hırvatistan', flag:'🇭🇷', players:[p('Luka Modrić','CM'),p('Mateo Kovačić','CM'),p('Joško Gvardiol','CB'),p('Andrej Kramarić','CF'),p('Ivan Perišić','LW'),p('Marcelo Brozović','CDM'),p('Lovro Majer','CAM'),p('Josip Šutalo','CB'),p('Josip Stanišić','RB'),p('Borna Sosa','LB'),p('Dominik Livaković','GK')]},
  { code:'MA', name:'Fas', flag:'🇲🇦', players:[p('Achraf Hakimi','RB'),p('Hakim Ziyech','RW'),p('Youssef En-Nesyri','ST'),p('Sofyan Amrabat','CDM'),p('Azzedine Ounahi','CM'),p('Brahim Díaz','CAM'),p('Nayef Aguerd','CB'),p('Romain Saïss','CB'),p('Noussair Mazraoui','LB'),p('Abde Ezzalzouli','LW'),p('Yassine Bounou','GK')]},
];

export function getNationalTeam(code){ return nationalTeams.find(t=>t.code===code) || null; }
export function nationalRewardOverall(stage){ const caps=[0,25,35,45,55,65,75,80,85,90,95,99]; return caps[Math.max(1,Math.min(11,Number(stage)||1))]; }
export function makeNationalReward(team, stage, alreadyOwned=[]){
  if(!team) return null;
  const remaining=team.players.filter(x=>!alreadyOwned.includes(x.name));
  if(!remaining.length) return null;
  const base=remaining[Math.floor(Math.random()*remaining.length)];
  const cap=nationalRewardOverall(stage);
  const floor=Math.max(10,cap-8);
  const overall=Math.floor(floor+Math.random()*(cap-floor+1));
  return { id:`real-${team.code}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, name:base.name, wikiTitle:base.wikiTitle, country:team.code, position:base.position, overall, rarity: overall>=95?'icon':overall>=88?'legendary':overall>=75?'epic':overall>=60?'platinum':overall>=45?'gold':overall>=30?'rare':'common', realPlayer:true, nationalTeamReward:true, specialReward:true, stageWon:Number(stage)||1 };
}
