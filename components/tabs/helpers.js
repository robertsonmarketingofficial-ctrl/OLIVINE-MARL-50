import { useState } from 'react'

function PageHeader({ title, sub, noMargin }) {
  return (
    <div style={{marginBottom:noMargin?0:24}}>
      <h1 style={{fontSize:22,fontWeight:800,color:'var(--text)',margin:'0 0 4px',letterSpacing:'-0.02em'}}>{title}</h1>
      {sub&&<p style={{fontSize:13,color:'var(--text3)',margin:0}}>{sub}</p>}
    </div>
  )
}

function InfoItem({ label, val }) {
  return (
    <div style={{background:'rgba(255,255,255,0.03)',borderRadius:7,padding:'8px 10px'}}>
      <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>{label}</div>
      <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{val}</div>
    </div>
  )
}

function WebsiteStrengthBar({ signal }) {
  const map = {'No website':{pct:5,color:'#ef4444'},'Social only':{pct:25,color:'#f97316'},'Basic builder':{pct:50,color:'#f59e0b'},'Has website':{pct:80,color:'#6d8a40'}}
  const {pct,color} = map[signal]||{pct:50,color:'#6b7280'}
  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--text3)',marginBottom:3}}>
        <span>Website strength</span><span style={{color}}>{signal}</span>
      </div>
      <div style={{height:4,background:'rgba(255,255,255,0.07)',borderRadius:2}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:2,transition:'width 0.6s'}}/>
      </div>
    </div>
  )
}

function ScoreBar({ score }) {
  const color = score>=75?'#ef4444':score>=50?'#f97316':'#6b7280'
  return (
    <div style={{height:5,background:'rgba(255,255,255,0.07)',borderRadius:3}}>
      <div style={{height:'100%',width:`${score}%`,background:color,borderRadius:3,transition:'width 0.6s'}}/>
    </div>
  )
}

export { PageHeader, InfoItem, WebsiteStrengthBar, ScoreBar }

export const AU_STATES = [
  { label: 'South Australia', short: 'SA', suburbs: ['Adelaide CBD','Glenelg','Norwood','Unley','Prospect','Marion','Salisbury','Port Adelaide','Morphett Vale','Mount Barker','Victor Harbor','Murray Bridge','Whyalla','Mount Gambier','Port Augusta','Port Pirie','Gawler','Elizabeth','Modbury','Tea Tree Gully','Golden Grove','Mawson Lakes','Munno Para','Christies Beach','Noarlunga','Aldinga Beach','Hallett Cove','Westfield Marion','Burnside','Kensington','Payneham','Magill','Campbelltown SA','Newton','Dernancourt','Para Hills','Ingle Farm','Davoren Park','Smithfield SA','Angle Vale','Two Wells','Kapunda','Nuriootpa','Tanunda','Angaston','Clare','Kadina','Wallaroo','Moonta','Port Wakefield','Crystal Brook'] },
  { label: 'Victoria', short: 'VIC', suburbs: ['Melbourne CBD','Richmond','Fitzroy','St Kilda','Prahran','South Yarra','Toorak','Hawthorn','Camberwell','Malvern','Caulfield','Carnegie','Oakleigh','Clayton','Dandenong','Frankston','Moorabbin','Bentleigh','Brighton VIC','Sandringham','Cheltenham VIC','Mentone','Mordialloc','Parkdale','Carrum','Seaford VIC','Geelong','Ballarat','Bendigo','Essendon','Footscray','Sunshine VIC','Werribee','Point Cook','Hoppers Crossing','Williamstown','Newport VIC','Altona','Laverton','Truganina','Melton','Bacchus Marsh','Keilor','Broadmeadows','Coburg','Preston','Northcote','Doncaster','Box Hill','Ringwood','Croydon VIC','Lilydale','Healesville','Mooroolbark','Bayswater','Wantirna','Knox','Rowville','Berwick','Narre Warren','Pakenham','Officer','Cranbourne','Frankston North','Seaford VIC'] },
  { label: 'New South Wales', short: 'NSW', suburbs: ['Sydney CBD','Parramatta','Bondi','Newtown','Manly','Chatswood','Hornsby','Penrith','Liverpool','Blacktown','Campbelltown NSW','Cronulla','Miranda','Sutherland','Hurstville','Kogarah','Rockdale','Bankstown','Lakemba','Strathfield','Burwood','Auburn','Merrylands','Granville','Wentworthville','Seven Hills','Toongabbie','Blacktown West','Mt Druitt','St Marys NSW','Kingswood','Katoomba','Richmond NSW','Windsor NSW','Rouse Hill','Castle Hill','Baulkham Hills','Kellyville','Norwest','Bella Vista','Newcastle','Maitland','Cessnock','Singleton','Muswellbrook','Wollongong','Dapto','Shellharbour','Kiama','Nowra','Albury','Wagga Wagga','Tamworth','Orange NSW','Dubbo','Broken Hill','Coffs Harbour','Port Macquarie','Armidale','Bathurst'] },
  { label: 'Queensland', short: 'QLD', suburbs: ['Brisbane CBD','Fortitude Valley','South Brisbane','West End QLD','Woolloongabba','Carindale','Mount Gravatt','Sunnybank','Moorooka','Rocklea','Acacia Ridge','Inala','Oxley','Darra','Richlands','Springfield QLD','Ipswich','Booval','Goodna','Redbank','Collingwood Park','Redbank Plains','Gold Coast','Surfers Paradise','Broadbeach','Southport','Robina','Burleigh Heads','Miami QLD','Palm Beach QLD','Coolangatta','Tweed Heads','Sunshine Coast','Maroochydore','Mooloolaba','Caloundra','Kawana Waters','Noosa','Toowoomba','Cairns','Townsville','Rockhampton','Bundaberg','Mackay','Hervey Bay','Gladstone','Mount Isa','Toowoomba East','Strathpine','Redcliffe','Deception Bay','Caboolture','Narangba','North Lakes','Mango Hill','Petrie','Brendale'] },
  { label: 'Western Australia', short: 'WA', suburbs: ['Perth CBD','Fremantle','Joondalup','Rockingham','Mandurah','Bunbury','Geraldton','Albany','Kalgoorlie','Northbridge','Subiaco','Cottesloe','Claremont WA','Nedlands','Floreat','Wembley','Osborne Park','Stirling WA','Balcatta','Karrinyup','Duncraig','Hillarys','Currambine','Butler','Clarkson WA','Quinns Rocks','Alkimos','Yanchep','Midland','Swan View','Ellenbrook','Bullsbrook','Armadale','Kelmscott','Byford','Mundijong','Baldivis','Secret Harbour','Golden Bay','Waikiki','Safety Bay','Shoalwater','Singleton WA','Lakelands','Madora Bay','Port Kennedy','Canning Vale','Willetton','Booragoon','Applecross','Brentwood','Murdoch','Winthrop','Kardinya','Spearwood'] },
  { label: 'Tasmania', short: 'TAS', suburbs: ['Hobart CBD','Sandy Bay','Battery Point','South Hobart','West Hobart','North Hobart','Glenorchy','Moonah','Claremont TAS','Rosny Park','Bellerive','Lindisfarne','Montrose','Launceston','Invermay','Newstead TAS','Kings Meadows','Newnham','Prospect TAS','Devonport','Spreyton','Ulverstone','Penguin','Burnie','Somerset','Wynyard','Smithton','Queenstown','Strahan','Huonville','Kingston TAS','Margate TAS','Snug','New Norfolk','Bridgewater','Brighton TAS'] },
  { label: 'Australian Capital Territory', short: 'ACT', suburbs: ['Canberra CBD','Civic','Belconnen','Tuggeranong','Woden','Gungahlin','Weston Creek','Bruce ACT','Charnwood','Florey','Macquarie ACT','Page ACT','Scullin','Weetangera','Calwell','Greenway','Theodore','Kambah','Wanniassa','Erindale','Monash ACT','Fadden','Gowrie','Chisholm','Isabella Plains','Banks','Holt','Higgins','Spence','Latham','Macgregor ACT','Evatt','Giralang','Kaleen','Lyneham','OConnor ACT','Ainslie','Watson','Downer','Hackett'] },
  { label: 'Northern Territory', short: 'NT', suburbs: ['Darwin CBD','Casuarina','Palmerston','Nightcliff','Rapid Creek','Fannie Bay','Stuart Park','Parap','Larrakeyah','Millner','Moil','Malak','Marrara','Berrimah','Humpty Doo','Coolalinga','Virginia NT','Batchelor','Pine Creek','Katherine','Tennant Creek','Alice Springs','Larapinta','Sadadeen','Gillen','Ross','Araluen'] },
]
