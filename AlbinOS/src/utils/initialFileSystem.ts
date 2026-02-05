import type { FileSystemNode } from '../types/FileSystem';

export const initialFileSystem: FileSystemNode = {
    name: 'root',
    type: 'directory',
    children: {
        'bin': {
            name: 'bin',
            type: 'directory',
            children: {},
        },
        'boot': {
            name: 'boot',
            type: 'directory',
            children: {},
        },
        'dev': {
            name: 'dev',
            type: 'directory',
            children: {},
        },
        'etc': {
            name: 'etc',
            type: 'directory',
            children: {},
        },
        'home': {
            name: 'home',
            type: 'directory',
            children: {
                'root': {
                    name: 'root',
                    type: 'directory',
                    children: {
                        'welcome.txt': {
                            name: 'welcome.txt',
                            type: 'file',
                            content: 'Välkommen till min emulerade bash miljö!\n\nSkriv "help" för att få en lista över bas kommandon.\nEn lista över alla kommandon finns i "commands.txt" som ligger i /home/root.\n\n=== CTF Utmaning ===\nDet finns en flagga nånstans i något system.\nKan du hitta den?',
                        },
                        'commands.txt': {
                            name: 'commands.txt',
                            type: 'file',
                            content: 'Available Commands:\n\nhelp   - List available commands\nclear  - Clear the terminal output\nwhoami - Display user information\npwd    - Print working directory\nls     - List directory contents\n         Flags: -l (long format),  -R (recursive)\ncd     - Change directory\ncat    - Concatenate files to standard output\nbanner - Display the banner\nssh    - Connect to a remote server\nexit   - Close the ssh session\ntouch  - Create an empty file\nnano   - Edit a file\njohn   - John the Ripper password cracker\nrm     - Remove files or directories\n         Flags: -r (recursive),  -F (force)\nsu     - Switch user\n',
                        },
                    }
                },
                'albin': {
                    name: 'albin',
                    type: 'directory',
                    children: {
                        'about_me.txt': {
                            name: 'about_me.txt',
                            type: 'file',
                            content: 'Hej Albin heter jag.\n\nJag är en IT-säkerhetsstudent som brinner lite extra för den offensiva sidan, det var så IT-säksintresset började.\nVår Windows XP dator var ingen match mot mig med metasploit. Mitt mål är att hamna inom red teaming.\n\nUtanför plugget spenderar jag mest tid på att programmera roliga projekt och labba i hemmamiljö.\nEn del av dem finns i /home/albin/projects/.\n\nUtforska gärna systemet, finns en del easter eggs.',
                        },
                        'projects': {
                            name: 'projects',
                            type: 'directory',
                            children: {}
                        },
                        'skills': {
                            name: 'skills',
                            type: 'directory',
                            children: {}
                        },
                        'john': {
                            name: 'john',
                            type: 'directory',
                            children: {
                                'README.md': {
                                    name: 'README.md',
                                    type: 'file',
                                    content: 'John the ripper is a tool for cracking passwords.\n\nCreate a hash file that contains a hash.\nUse john to crack the hash.\nUsage: john --wordlist=<wordlist> <hashfile>\nExample: john --wordlist=rockyou.txt hashfile.txt',
                                },
                                'rockyou.txt': {
                                    name: 'rockyou.txt',
                                    type: 'file',
                                    content: '123456\npassword\n12345678\nqwerty\n123456789\n12345\n1234567890\n1234567\nabc123\npassword1\n111111\n123123\nadmin\nletmein\nwelcome\nmonkey\ndragon\nmaster\nsunshine\nprincess\nqwertyuiop\n1q2w3e4r\n654321\nsuperman\n1qaz2wsx\n7777777\nfuckyou\nletmein1\n000000\nzxcvbnm\nqwerty1\niloveyou\ntrustno1\ncharlie\nshadow\nashley\nfootball\njesus\nmichael\nninjaaa\nmustang\npassword123\naccess\nmaster1\nflower\nhotdog\nloveme\nwhatever\ndonald\npassword2\nguest\ndragon1\nmonkey1\nstarwars\ncomputer\nhello123\nfreedom\nwhatever1\nqazwsx\ntrustno1\nranger\njordan\nmaster123\nfotboll123\nhejsan123\nsommar2024\nstockholm\ngöteborg\nmalmö123\nkungen99\nviking2000\nfotboll\nhockey123\nsvansen\nälansen22\nblåbär456\nrödbulansen\nkotte123\nsnöflinga\nvinter2025\njuldansen\npepparkakor\nKjellbackman123\nsallad999\nmorot123\ngurka456\nkanelbulle\nfika2024\ndalahäst\nsmörgåstårta\nsurströmming\nlingon123\nmidsommar\nlucia2024\nskärgård\nsemla123\nköttbulle\nnobel123\nvolvo240\nsaab900\nikea2024\nabba1974\nzlatan10\nbjörnborgaren\nastriden99\npippi123\nkarlsson99\nsvenson\nlindgren\nandersson\njohansson\neriksson\nlars123\nanna2024\nolof99\ningrid\ngreta2024\ncarl16\ngustav\nvictoria\nmadeleine\nsilvia123\nostermalmstorg\ngamlastan\ndjurgården\nvasastan\nsodermalm\nuppsala\nlinkoping\nmalmo2024\nhelsingborg\njönköping\norebro123\nvasteras\nkiruna99\nvisby123\nkalmar\nkarlstad\nlulea2024\numea123\nsundsvall\ngavle99\neskilstuna\nvaxjo123\nhalmstad\nborås99\nkristianstad\nuddevalla\ntrollhattan\nfalun123\nlidkoping\nostersund\nnyköping99\nskovde\nvarberg\ntrelleborg\nkarlskrona\nystad123\nchangjävel99\nfanskap\nhelvete123\njävlabajs\nskitbra99\nfittajävel\nkuksugen\narsle123\nbabian99\nblatte\nbögävel\nsnorungar\nflundra99\nfjanteri\nglin123\ngoliat99\nhoran\nidiot123\njycke99\nkioskmongo\nluffare\nmongo123\nnolla99\nordvits\npucko123\nrövhatt99\nskitunge\ntorsk123\ntoker99\nuffes\nvildhjärna\nwallraff\nxerxes123\nyxskaft99\nzigenare\naborre123\nbraxen99\ngädda\ngös123\nlax99\nöring\nsik123\nmört99\nkarp\nhummer123\nkrabba99\nräka\nmusla123\nostron99\nblåmussla\nhavskräfta\npilgrimsmussla99\nsjötunga123\nstenbitsrom99\nkaviar\nlöjrom123\ntobis99\nskarpsill\nansjovis123\nströmming99\nbockling\nsurströmming123\ngravadlax99\nrimmadlax\nvarmrökt123\nkallrökt99\ngrillad\nstekt123\nkokt99\nångad\nugn123\nmikro99\nfryst\nfärsk123\nekologisk99\nnärodlad\nimporterad123\nhemgjord99\nhandgjord\nfabrikstillverkad123\nindustriell99\nmaskinell\nmanuell123\nautomatisk99\ndigital\nanalog123\ntrådlös99\ntrådad\nkabellös123\nfiber99\nadsl\n4G123\n5G99\nwifi\nbluetooth123\nnfc99\nusbc\nlightning123\nthunderbolt99\nhdmi\nvga123\ndvi99\ndisplayport\nscart123\nkomposit99\nkomponent\noptisk123\nkoaxial99\nbalanserad\nobalanserad123\nmono99\nstereo\nsurround123\natmos99\ndtsx\nauro3d123\nimax99\ndolby\nthx123\ndts99\nmpeg\naac123\nflac99\nalac\nape123\nwav99\nmp3\nogg123\nopus99\nvorbis\nwma123\naiff99\nau\nsnd123\npcm99\nadpcm\natrac123\nminidisc99\ndat\ndcc123\nelcassette99\nvhs\nbeta123\nlaserdisc99\nvcd\nsvcd123\ndvd99\nbluray\nhddvd123\numd99\n4k\n8k123\nhdr99\ndolbyvision\nhdr10123\nbrunstigälg99\nhlg99\npq\nsdr123\nrec709\nrec2020123\ndcip3\nadobergb99',
                                },
                            }
                        },
                        'hemligt': {
                            name: 'hemligt',
                            type: 'directory',
                            children: {
                                'Filip-Poon-Wok.txt': {
                                    name: 'Filip-Poon-Wok.txt',
                                    type: 'file',
                                    content: 'Filip-Poon Kyckling wok med broccoli och cashewnötter\n\n500g kycklinglårfile, strimlad\n500g broccoli\n1 röd paprika\n4klyftor vitlök\n4cm färsk ingefära\n1 dl rostade cashewnötter\n65 g babyspenat\n3 msk japansk soja\n1 msk ostronsås\n1 msk sesamolja\n1 tsk strösocker\nrapsolja, till stekning',
                                },
                                'kom-ihåg.txt': {
                                    name: 'kom-ihåg.txt',
                                    type: 'file',
                                    content: 'ssh inlogg\ntyrell@72.78.13.162\nKjellbackman123',
                                },
                            }
                        }
                    }
                }
            }
        },
        'lib': {
            name: 'lib',
            type: 'directory',
            children: {},
        },
        'media': {
            name: 'media',
            type: 'directory',
            children: {},
        },
        'mnt': {
            name: 'mnt',
            type: 'directory',
            children: {},
        },
        'opt': {
            name: 'opt',
            type: 'directory',
            children: {},
        },
        'sbin': {
            name: 'sbin',
            type: 'directory',
            children: {},
        },
        'srv': {
            name: 'srv',
            type: 'directory',
            children: {},
        },
        'tmp': {
            name: 'tmp',
            type: 'directory',
            children: {},
        },
        'usr': {
            name: 'usr',
            type: 'directory',
            children: {},
        },
        'var': {
            name: 'var',
            type: 'directory',
            children: {},
        },
    }
};

