'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import ReadMoreFade from './ui/ReadMore'

export default function HomeInfo() {

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Main Info Section */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="home-info-heading mb-6">
            Veselības centrs Adoria – Jūsu veselībai un skaistumam
          </h2>

          <p className="text-base sm:text-lg text-[#706152] mb-4">
            Veselība – tā ir cilvēka vislielākā bagātība.
          </p>

          <ReadMoreFade
            maxHeight={250}
            fadeHeight={60}
            buttonText="Lasīt vairāk"
            collapseText="Lasīt mazāk"
            showCollapseButton={true}
          >
            <div className="text-base sm:text-lg text-[#706152] space-y-4 text-justify">
              <p>
                Atbilstošas un regulāras fiziskās aktivitātes, veselīgs un vitamīniem bagāts uzturs, pietiekama ūdens lietošana ikdienā, kvalitatīvs miegs un spēja pārvarēt ikdienas stresu, – tas viss veido mūsu organisma un ķermeņa vispārējo veselību, labsajūtu un vitalitāti.
              </p>

              <p>
                Un tieši tik pat svarīgi kā rūpēties par savu veselību katru dienu, ir atrast zinošus un uzticamus ārsta speciālistus, kam ikdienā uzticēt rūpes par savu veselību.
              </p>

              <p>
                Mūsu veselības centrs Adoria, kas atrodas pašā Rīgas centrā, blakus Ziedondārzam, ir vieta, kur vienotā komandā strādā kompetenti, zinoši, augstas klases ārstniecības profesionāļi.
              </p>

              <p className="font-semibold">
                Veselības un skaistuma Centrs Adoria patiesi lepojas ar saviem speciālistiem, kas ir savas jomas profesionāļi, kuru sirds aicinājums ir palīdzēt ikvienam pacientam, sniegt pakalpojumus visaugstākajā līmenī un būt pieejamiem maksimāli ātrā laikā!
              </p>

              {/* Extended Content */}
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Misija</h3>
                  <p>
                    Mūsu misija ir, sagaidīt pacientus ar laipnu smaidu un pretimnākošu attieksmi, sniedzot kvalitatīvu, drošu, balstītu uz jaunākajām tendencēm un pieņemtām vadlīnijām, medicīnisko aprūpi, tādejādi rūpējoties par to, lai saglabātu un uzlabotu sabiedrības veselību, kā arī paaugstinātu mūsu pacientu dzīves kvalitāti.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Vīzija</h3>
                  <p>
                    Izveidot mūsdienīgu un komfortablu veselības un skaistuma centru ar plaša spektra veselības aprūpes un skaistumkopšanas pakalpojumiem, uzņemoties rūpes par mūsu klientu veselību un skaistumu jebkurā vecumā, tā lai klients justos vienmēr gaidīts.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Kas ir mūsdienīgs veselības centrs?</h3>
                  <p className="mb-4">Kas tad īsti ir mūsdienīgs veselības centrs?</p>
                  <p className="mb-4">
                    Gan Rīgā, gan citos Latvijas reģionos pieejami daudz veselības centri. Taču tie būtiski atšķiras savā starpā.
                  </p>
                  <p className="mb-4">
                    Mūsu pacientu atsauksmes liecina par to, ka daudzi no tiem līdzinās agrāk tik pazīstamajām poliklīnikas tipa iestādēm. Speciālistu un pacientu daudz, garas rindas, speciālisti grūti pieejami un ierobežoti vizītes laiki. Tas, bieži vien, rezultējās mazāk kvalitatīvā apkalpošanā, turklāt no pārlieku lielās slodzes ārstiem ir grūti iedziļināties pacientu problēmās padziļināti un ar patiesu interesi.
                  </p>
                  <p className="mb-4">Tas arī ir tas, ar ko atšķiras mūsdienīgs veselības centrs.</p>
                  <p>
                    Mūsu veselības un skaistuma centrs Adoria nerimstoši strādā pie tā, lai saglabātu un uzturētu sevis izvirzīto Misiju un Vīziju par to, kādai būtu jābūt kvalitatīvai, uz pacientiem orientētai veselības aprūpei.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Padziļināta uzmanība un interese par ikvienu pacientu – mūsu moto!</h3>
                  <p className="mb-4">
                    Mūsu veselības centrs Adoria var lepoties, ka mūsu ārsti pacientam velta visu nepieciešamo uzmanību, neatkarīgi no tā, cik laika tas prasa.
                  </p>
                  <p className="mb-4">
                    Rūpīgi saplānots ikkatrs apmeklējuma laiks nodrošina to, ka mūsu pacienti saņem kvalitatīvu un padziļinātu uzmanību.
                  </p>
                  <p className="mb-4">
                    Mēs zinām, cik neaizsargāts un vājš var justies cilvēks, kad viņa veselību piemeklējušas problēmas. Cilvēcīga, pretimnākoša un laipna attieksme un komunikācija ir viens no veselības aprūpes pamatakmeņiem.
                  </p>
                  <p>
                    Mēs rūpējamies par to, lai mūsu pacienti justos uzklausīti un pieņemti, kā arī izietu no mūsu ārstu kabinetiem ar saņemtām skaidrām un saprotamām atbildēm. Izskaidrojot visu nepieciešamo informāciju un sniedzot atbildes un pacientu jautājumiem, veidojas tik svarīgā savstarpējā atgriezeniskā saite, kad ārstniecības persona un pacients strādā kā vienota komanda.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Pakalpojumu pieejamība</h3>
                  <p className="mb-4">Veselības problēmas un dažādas kaites, diemžēl, negaida.</p>
                  <p className="mb-4">
                    Taču vēl aizvien plaši izplatīta problēma ir garās rindas pie ārstniecības speciālistiem. Un, pat ja pacients izvēlās izmantot maksas pakalpojumus, gana bieži novērojams, ka operatīvi tikt pie izvēlētā speciālista nav iespējams.
                  </p>
                  <p className="mb-4">
                    Mūsu veselības un skaistuma centrs Adoria ir viens no retajiem medicīnas pakalpojumu sniedzējiem, kas strādā pie tā, lai rindas pie speciālistiem būtu krietni vien īsākas, kā citās veselības iestādēs, vai rindu nebūtu vispār.
                  </p>
                  <p>To nodrošinām rūpīgi plānojot un optimizējot apmeklētāju plūsmu.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Mājīga un mūsdienīga atmosfēra</h3>
                  <p className="mb-4">
                    Viens no faktoriem, kas liek mūsu pacientiem atgriezties tieši pie mums, ir patīkamā un mājīgā atmosfēra.
                  </p>
                  <p className="mb-4">
                    Neskatoties uz to, ka sniedzam ārstniecības pakalpojumus, mūsu veselības centrs ir īpaši ierīkots, piedomājot pie tā, lai pacienti justos mājīgi, mierīgi un patīkami laikā, kas pavadīts mūsu klīnikā.
                  </p>
                  <p>
                    Omulīga un stresu mazinoša atmosfēra ir svarīga ikvienam pacientam, taču īpaši svarīga mūsu mazākajiem pacientiem. Gan ārstu kabineti, gan pārējās veselības centra telpas iekārtotas tā, lai savstarpējā komunikācija starp ārstiem un pacientiem, kā arī pārējo personālu neradītu lieku satraukumu.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Ne tikai veselībai, bet arī skaistumam</h3>
                  <p className="mb-4">
                    Veselības un skaistuma centrs Adoria izceļas arī ar to, ka apvieno rūpes gan par pacientu veselību, gan skaistumu.
                  </p>
                  <p className="mb-4">
                    Ar vienotu pieeju visam pacienta ķermenim un organismam kopumā, iespējams panākt ilgtermiņā daudz veiksmīgāku rezultātu.
                  </p>
                  <p className="mb-4">
                    Mūsu ķermenis ir pelnījis atpūtu, tieši tāpēc mūsu veselības centrs piedāvā daudz dažādus skaistumkopšanas un labsajūtu veicinošus pakalpojumus.
                  </p>
                  <p className="mb-4">
                    Dažādas masāžas procedūras ļaus aizmirst ikdienas stresus un ļauties nomierinošai atmosfērai, kamēr mūsu profesionālā skaistumkopšanas speciālistu komanda parūpēsies, lai Jūsu seja starotu un ķermenis būtu atpūties.
                  </p>
                  <p className="mb-4">
                    Piedāvājam plašu kosmetoloģisko procedūru klāstu, kā ārstnieciskā un estētiskā kosmetoloģija, masāžas un pretcelulīta procedūras, vaksāciju, lāzerepilāciju, mezoterapiju u.c.
                  </p>
                  <p>
                    Papildus piedāvājam arī fizioterapijas pakalpojumus, lai ķermenis būtu ne tikai atpūties, bet arī vesels un spētu pilnvērtīgi funkcionēt.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#706152] mb-3">Pieejamība</h3>
                  <p className="mb-4">
                    Mūsu veselības centrs atrodas pašā Rīgas centrā, sniedzot iespēju ikvienam ātri un ērti apmeklēt klīniku. Mūsu klīnika būs ērti sasniedzama gan ar kājām, gan sabiedrisko transportu, turpat blakus ir arī ērtas auto novietošanas iespējas.
                  </p>
                  <p className="mb-4">
                    Papildu pluss ir arī tas, ka no pirmdienas līdz ceturtdienai pieņemam savus pacientus līdz 19:00 vakarā, sniedzot iespēju apmeklēt speciālistus arī pēc darba laika. Tāpat arī, pēc iepriekšēja pieraksta, pie atsevišķiem speciālistiem iespējams pieteikt vizīti arī sestdienās.
                  </p>
                  <p className="mb-4">
                    Tas ir īpaši svarīgi mūsu pacientiem, kas piesaka vizītes no attālākiem Latvijas reģioniem.
                  </p>
                  <p className="mb-4">
                    Mēs aicinām – rūpes par savu un savas ģimenes locekļu veselību atstāj mūsu zinošo speciālistu rokās.
                  </p>
                  <p className="font-semibold text-[#706152]">
                    Veselības un skaistuma centrs Adoria – mūsdienīgs veselības centrs ikvienam!
                  </p>
                </div>
              </div>
            </div>
          </ReadMoreFade>
        </div>

        {/* Image Section */}
        <div className="max-w-4xl mx-auto text-center">

          {/* CTA Content */}
          <div className="text-center">
            <h2 className="home-info-heading mb-6">
              Veselības centra Adoria – sociālā uzņēmējdarbība
            </h2>

            <div className="relative mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl mx-auto max-w-4xl">
                <Image
                  src="/EUFonds.webp"
                  alt="Adoria veselības centrs"
                  width={600}
                  height={400}
                  className="w-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#706152]/10 to-transparent" />
              </div>
          </div>

            <p className="text-lg text-[#706152] mb-8 leading-relaxed max-w-3xl mx-auto">
            “Adoria” kopš 2020.gada, 10.septembra ir reģistrēts sociālais uzņēmums, 
            kas reģistrēts Labklājības Ministrijas sociālā uzņēmumu reģistrā ar <strong>Nr.LM-32-4-19/67</strong>.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl hover:shadow-[#B7AB96]/20 transition-all duration-300 transform md:hover:-translate-y-1 md:hover:scale-105 min-h-[40px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Uzzināt vairāk</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
