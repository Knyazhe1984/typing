// Frequent English words plus words from small letter sets for the first lessons.
// Hand-made list, same license as the project (MIT).
const text = `
the of and to a in is it you that he was for on are with as his they be at one have
this from or had by word but what some we can out other were all there when up use
your how said an each she which do their time if will way about many then them write
would like so these her long make thing see him two has look more day could go come
did number sound no most people my over know water than call first who may down side
been now find any new work part take get place made live where after back little only
round man year came show every good me give our under name very through just form
sentence great think say help low line differ turn cause much mean before move right
boy old too same tell does set three want air well also play small end put home read
hand port large spell add even land here must big high such follow act why ask men
change went light kind off need house picture try us again animal point mother world
near build self earth father head stand own page should country found answer school
grow study still learn plant cover food sun four between state keep eye never last
let thought city tree cross farm hard start might story saw far sea draw left late run
while press close night real life few north
as ask add all dad sad fall hall flask glass half shall salad gas lad flag slash dash
ash hash lass alas gall fads lads asks adds falls halls flags glad gash sag hag lash
flash shall jags

feel field file fill fire fish free fresh friend fruit full fear feed fell field
deed deal dear deep desk did die diet dish dress drive drill dried dealer dread
seed seek seem seen self sell side sir slide slid sled said safe sea seal
ideal idea ill isle like life lid lie lied fields fled ride rider
red rule rude rug run rush rural real read rear ready raise rise rid refer
ruler user sure sugar surf fur fuel rude rush duel dull hull hurl huge
tree true trust tired tide tight till tile title test text toast try type yard yes
yet year yell yield style stay state treat street sister trial attitude
wait walk wall war warm wash watch wave weak wear week west wet wide wife wild
will win wind wise wish with wolf wood wool word work worry wrote world worse
out our over oil old open order owner own wood food floor door fool tool pool
quiet quite quick queen quest quote equal square quarter question quit
paper park part party pass past path pay peace pen pencil people pepper pet
photo pick piece pig pink pipe plan plate play please plus poem police pool poor

very voice visit view value valley vast verse vote video vivid even ever every
move milk mile mind mine miss mix model money month moon more morning mouse mouth
man map mark market master match meal meat meet member memory metal middle
bad bag ball band bank base basket bath bear beat bed bee begin bell belt best
bird birth black blind block blood blue board boat body bone book born both box
brain bread break bridge bright bring brown build busy butter buy baby back
nail name narrow nation nature neck needle nest net news next nice nine noise nose
note nothing now number nut never
cake call calm camp car card care carry case castle cat catch cell chain chair
chance cheap check cheese chest chicken child chin circle class clean clear clock
cloud coat cold color comb come cook cool copy corn cost cotton count cup cut
exam example excel extra exit expert next fox box six mix taxi wax
zero zone zoo zip lazy size prize maze crazy dozen frozen
jam jar job join joke joy judge juice jump just jacket january july june
know knee knife knock kitchen kite key kick kid king kiss

about above across act add afraid after again against age ago agree ahead
air alive allow almost alone along already also always among angry animal
another answer any apple area arm army around arrive art aside asleep aunt
autumn away awful baby before begin behind believe below beside better beyond
birthday blanket borrow bottle bottom branch brave breakfast brother brush
building burn cabin candle captain careful carpet center century certain
chalk cheek choose church city clever climb clothes coast coffee coin collect
corner cottage cousin cover cream crowd cry curtain daily dance danger dark
daughter dead dear decide deep deer delight dinner dirty doctor dollar donkey
dream drink drop dry duck dust eager early earn easy eat edge egg eight elbow
empty enemy enjoy enough enter evening exact excited eye face fact fair faith
family famous fancy fast fat favor feather fence fever fight finger finish
flower fly fog forest forget fork forty forward fresh friday front funny future
garden gate gentle giant gift girl glove goat gold grass gray green ground
group guess guest gun hair hammer happy harbor hat hate hay heart heat heavy
hello hill hole holiday honest honey hope horse hospital hot hour hungry hurry
ice inch inside iron island jelly kettle lady lake lamp language laugh lawn
leaf lemon lesson letter library lift lion lip list listen loud love lucky lunch
machine mail marry meadow minute mirror mistake monday mountain music nearly
neighbor newspaper noon nurse ocean office often orange outside oven pain paint
pair palace pan parent pear perhaps person pillow pilot plane pocket polite
potato pretty print problem pull pupil purple push puzzle rabbit radio rain
reach record remember rest rich river road rock roof room rope rose rough salt
sand saturday sauce scarf season seat second secret send serve seven shade
shadow shape share sharp sheep shelf shell shine ship shirt shoe shop short
shoulder shout silent silk silver simple sing sink skin skirt sky sleep slow
smile smoke snake snow soap soft soldier son soon sorry soup south space speak
speed spend spoon spring stamp star station step stick stone storm strange
straw strong student sudden summer sunday supper sweet swim table tail talk
tall taste tea teach team tear teeth thank thick thin thirsty thursday ticket
tiger tiny today toe together tomorrow tongue tonight tooth top touch towel
tower town toy train travel tuesday turtle twelve twenty uncle until upon
useful usual vegetable village violin visitor wagon warm wednesday weather
wheel whisper white whole window wing winter wonder wooden yellow young
`

export const enWords: readonly string[] = [...new Set(text.trim().split(/\s+/))]
