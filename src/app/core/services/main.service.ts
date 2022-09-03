import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MainService {
  private A$ = new BehaviorSubject(null); //* Altitud
  private B$ = new BehaviorSubject(null); //* Temperatura

  private C$ = new BehaviorSubject(null); //* Tension Máxima
  private D$ = new BehaviorSubject(null); //* Nivel Básico de Aislamiento
  private D_1$ = new BehaviorSubject(null); //* Distancia Crítica
  private E$ = new BehaviorSubject(null); //* Nivel de conmutacion
  private F$ = new BehaviorSubject(null); //* Nivel de contaminacion | Muy ligero - ligero - medio - pesado - Muy pesado

  private N_1$ = new BehaviorSubject(null); //* Número de conductores por fase
  private T_1$ = new BehaviorSubject(null); //* Tensión Horizontal Máxima

  private G$ = new BehaviorSubject(null); //* Tipo de Aislador o Perfil
  private H$ = new BehaviorSubject(null); //* Código de Aislador
  private I$ = new BehaviorSubject(null); //* Carga
  private J$ = new BehaviorSubject(null); //* Distancia de Fuga
  private K$ = new BehaviorSubject(null); //* Paso
  private L$ = new BehaviorSubject(null); //* Diámetro
  private M$ = new BehaviorSubject(null); //* TF - Seco
  private N$ = new BehaviorSubject(null); //* TF - Lluvia
  private O$ = new BehaviorSubject(null); //* TF - Rayo
  private P$ = new BehaviorSubject(null); //* Peso del Aislador

  private Q$ = new BehaviorSubject(null); //* Humedad Relativa

  private R$ = new BehaviorSubject(null); //* Facotr de Corrección por Lluvia

  private P_H$ = new BehaviorSubject(null); //* Peso del herraje de la Cadena
  private Z$ = new BehaviorSubject(null);

  //* Aqui se incluye la tabla de FC HUMEDAD
  private fila00 = new Array(
    1.14492693817068,
    1.14089223721216,
    1.11979945698454,
    1.12015942404286,
    1.1125599365521,
    1.10714297969797,
    1.09736524230048,
    1.09417581024907,
    1.08752743413451,
    1.07666905860132
  );
  private fila01 = new Array(
    1.14363001418206,
    1.13861077695356,
    1.11910864651255,
    1.11766949958936,
    1.10984326006871,
    1.10362937880712,
    1.09381732037936,
    1.08954026337656,
    1.08258558713999,
    1.07191786395579
  );
  private fila02 = new Array(
    1.14239911478649,
    1.1364171182822,
    1.11828012668987,
    1.11515852045196,
    1.10703346177756,
    1.10005624198645,
    1.09014830735863,
    1.08484951084914,
    1.07755023033129,
    1.06699670699169
  );
  private fila03 = new Array(
    1.14122649437758,
    1.13430127654193,
    1.11730834929641,
    1.1126094295084,
    1.10411496933318,
    1.09640820470469,
    1.08634458486866,
    1.08008139916833,
    1.07240115207718,
    1.06188821610548
  );
  private fila04 = new Array(
    1.14010448382268,
    1.13225343012175,
    1.11618791802226,
    1.11000550252617,
    1.10107265262569,
    1.09267041045337,
    1.08239314737701,
    1.07521475827183,
    1.0671192596816,
    1.05657629821997
  );
  private fila05 = new Array(
    1.1390254837483,
    1.13026390941071,
    1.11491360424086,
    1.10733036453942,
    1.09789186212468,
    1.08882854002164,
    1.07828164930322,
    1.07022945266345,
    1.06168664777219,
    1.05104623832438
  );
  private fila06 = new Array(
    1.13798195878093,
    1.12832318728736,
    1.11348036328051,
    1.104568011473,
    1.09455847187781,
    1.08486884537469,
    1.07399845599422,
    1.06510644239594,
    1.05608667532838,
    1.04528480569858
  );
  private fila07 = new Array(
    1.13696643273423,
    1.12642187112048,
    1.11188335116285,
    1.10170283689697,
    1.09105892697381,
    1.08077818793794,
    1.06953269828159,
    1.05982785333143,
    1.05030405063713,
    1.03928036588524
  );
  private fila08 = new Array(
    1.13597148473502,
    1.12455069625972,
    1.11011794177444,
    1.09871966378211,
    1.08738029525586,
    1.07654408106853,
    1.06487433031133,
    1.05437705604343,
    1.04432492338699,
    1.03302299736776
  );
  private fila09 = new Array(
    1.1349897462808,
    1.12270052099638,
    1.1081797444341,
    1.09560378111197,
    1.08351032304444,
    1.07215473647235,
    1.06001419030396,
    1.0487387526548,
    1.03813698302468,
    1.02650461179724
  );
  private fila10 = new Array(
    1.13401389922256,
    1.12086232297573,
    1.1060646218163,
    1.09234098518889,
    1.07943749460003,
    1.06759911429974,
    1.05494406386654,
    1.04289907082776,
    1.03172956240383,
    1.01971907648836
  );
  private fila11 = new Array(
    1.13303667466658,
    1.11902719704296,
    1.10376870818682,
    1.08891762545116,
    1.07515109502359,
    1.06286697662394,
    1.04965674944053,
    1.03684566403462,
    1.0250937456512,
    1.01266233777149
  );
  private fila12 = new Array(
    1.13205085278978,
    1.11718635450574,
    1.10128842790458,
    1.08532065459528,
    1.07064127625911,
    1.05794894397617,
    1.04414612542795,
    1.03056781714218,
    1.01822247906323,
    1.00533254364777
  );
  private fila13 = new Array(
    1.13104926356268,
    1.11533112379621,
    1.09862051413926,
    1.08153768277158,
    1.06589912582489,
    1.05283655457711,
    1.03840721849501,
    1.02405655623765,
    1.01111068372444,
    0.997730164043433
  );
  private fila14 = new Array(
    1.13002478837436,
    1.11345295251548,
    1.09576202775136,
    1.07755703559334,
    1.06091673786081,
    1.04752232586871,
    1.03243627250618,
    1.01730476151048,
    1.00375536840847,
    0.989858106801346
  );
  private fila15 = new Array(
    1.12897036255355,
    1.11154341084294,
    1.09271037627751,
    1.07336781566836,
    1.05568728603688,
    1.04199981791162,
    1.02623081749291,
    1.01030728188186,
    0.996155741183848,
    0.981721827379969
  );
  private fila16 = new Array(
    1.12787897877917,
    1.10959419629214,
    1.08946333296021,
    1.06895996732859,
    1.05020509782282,
    1.03626369817168,
    1.01978973800973,
    1.00306104994249,
    0.988313317998364,
    0.973329430053667
  );
  private fila17 = new Array(
    1.12674369137378,
    1.10759713979388,
    1.08601905575704,
    1.0643243441973,
    1.04446572957185,
    1.03030980717548,
    1.01311334017665,
    0.995565195619026,
    0.980232026359277,
    0.964691758223103
  );
  private fila18 = new Array(
    1.1255576214719,
    1.10554421308565,
    1.08237610626084,
    1.05945277919434,
    1.03846604182097,
    1.02413522446812,
    1.00620341664989,
    0.987821156840762,
    0.971918302060965,
    0.955822471250454
  );
  private fila19 = new Array(
    1.12431396305482,
    1.10342753738491,
    1.07853346845791,
    1.05433815653883,
    1.03220427415781,
    1.017738334257,
    0.999063308704104,
    0.979832785320241,
    0.963381176737222,
    0.946738105031374
  );
  private fila20 = new Array(
    1.12300598984215,
    1.10123939332159,
    1.07449056724732,
    1.04897448526462,
    1.02568011894876,
    1.01111889007397,
    0.991697964547131,
    0.971606445395068,
    0.954632353832213,
    0.93745811330399
  );
  private fila21 = new Array(
    1.12162706302931,
    1.09897223210271,
    1.07024728663993,
    1.04335697371717,
    1.01889479316499,
    1.00427807773341,
    0.984113992923946,
    0.963151103702712,
    0.945686270392037,
    0.928004886474792
  );
  private fila22 = new Array(
    1.12017063985841,
    1.09661868787958,
    1.0658039875515,
    1.03748210445148,
    1.01185110748259,
    0.997218575807022,
    0.976319710999529,
    0.954478407275947,
    0.936560141878016,
    0.918403744511973
  );
  private fila23 = new Array(
    1.11863028300901,
    1.09417159128455,
    1.06116152509958,
    1.03134770889855,
    1.00455353176994,
    0.989944612776256,
    0.96832518544055,
    0.945602747453527,
    0.927273986993123,
    0.90868290021872
  );
  private fila24 = new Array(
    1.11699967079273,
    1.09162398410144,
    1.05632126530928,
    1.02495304111385,
    0.997008256009589,
    0.982462019961153,
    0.96014226554356,
    0.936541306798888,
    0.917850629294529,
    0.898873388952048
  );
  private fila25 = new Array(
    1.11527260813449,
    1.08896913502944,
    1.05128510112835,
    1.01829884986393,
    0.989223245633493,
    0.974778279259479,
    0.951784607182474,
    0.927314086008996,
    0.908315672137863,
    0.889008960597029
  );
  private fila26 = new Array(
    1.11344303832063,
    1.086200556497,
    1.04605546764696,
    1.01138744824767,
    0.981208290179744,
    0.96690256466248,
    0.943267686270596,
    0.917943907575999,
    0.898697443262731,
    0.879125929341754
  );
  private fila27 = new Array(
    1.11150505549198,
    1.0833120224771,
    1.04063535641278,
    1.00422277998648,
    0.972975044104989,
    0.958845776443536,
    0.934608800352341,
    0.908456392736052,
    0.889026905084042,
    0.869262976524989
  );
  private fila28 = new Array(
    1.10945291785784,
    1.08029758725119,
    1.03502832872677,
    0.996810481452994,
    0.964537058510798,
    0.950620566843238,
    0.925827056857045,
    0.898879908002574,
    0.879337526499948,
    0.859460901546323
  );
  private fila29 = new Array(
    1.10728106160378,
    1.07715160506387,
    1.02923852779984,
    0.989157938439905,
    0.955909802463288,
    0.942241355999087,
    0.916943346461931,
    0.889245477335296,
    0.869665111764624,
    0.8497623155376
  );
  private fila30 = new Array(
    1.10498411546385,
    1.07386875060489,
    1.0232706896454,
    0.981274336600992,
    0.947110672503927,
    0.933724336790082,
    0.907980299923313,
    0.879586655741659,
    0.860047581702717,
    0.840211272194637
  );
  private fila31 = new Array(
    1.10255691592461,
    1.07044404024978,
    1.01713015257716,
    0.973170704423259,
    0.938158988865384,
    0.925087467185871,
    0.898962226644563,
    0.86993935984365,
    0.850524702262071,
    0.830852829859567
  );
  private fila32 = new Array(
    1.09999452302537,
    1.06687285398396,
    1.01082286517626,
    0.96485994751399,
    0.92907597681964,
    0.916350448607001,
    0.88991503315617,
    0.860341650670684,
    0.841137755112301,
    0.821732538626739
  );
  private fila33 = new Array(
    1.09729223671601,
    1.06315095792922,
    1.00435539258594,
    0.956356872908511,
    0.919884731496311,
    0.907534688717002,
    0.880866119587418,
    0.850833463658044,
    0.831929144698957,
    0.812895845918803
  );
  private fila34 = new Array(
    1.09444561372976,
    1.05927452738482,
    0.997734920986345,
    0.947678202023891,
    0.91061016441724,
    0.898663246978642,
    0.871844252110807,
    0.841456280540293,
    0.822941935856306,
    0.804387413644553
  );
  private fila35 = new Array(
    1.09145048492562,
    1.05524017028809,
    0.990969260096049,
    0.938842570800657,
    0.901278929898934,
    0.88976076121568,
    0.862879409239295,
    0.8322527375303,
    0.81421931576633,
    0.796250339706189
  );

  private fchumedad = new Array(
    this.fila00,
    this.fila01,
    this.fila02,
    this.fila03,
    this.fila04,
    this.fila05,
    this.fila06,
    this.fila07,
    this.fila08,
    this.fila09,
    this.fila10,
    this.fila11,
    this.fila12,
    this.fila13,
    this.fila14,
    this.fila15,
    this.fila16,
    this.fila17,
    this.fila18,
    this.fila19,
    this.fila20,
    this.fila21,
    this.fila22,
    this.fila23,
    this.fila24,
    this.fila25,
    this.fila26,
    this.fila27,
    this.fila28,
    this.fila29,
    this.fila30,
    this.fila31,
    this.fila32,
    this.fila33,
    this.fila34,
    this.fila35
  );

  metodo1(A, C, F, G, J, L, D_1, K) {
    //* Calcular N1
    let temp;

    if (A >= 1000) {
      temp = Math.exp(G * (A / 8150));
    } else {
      temp = 1;
    }
    console.log('temp: ');
    console.log(temp);

    let N1 = 0;
    if (L >= 300) {
      N1 = (1.15 * F * temp * (0.0005 * L + 0.85) * C) / (J * Math.sqrt(3));
    } else {
      N1 = (1.15 * F * temp * C) / (J * Math.sqrt(3));
    }
    console.log('N1: ');
    console.log(N1);

    let S = (N1 * J * Math.sqrt(3)) / (C * 1.15 * D_1);
    console.log('S: ');
    console.log(S);

    if (F == 22) {
      if (S >= 4.25) {
        console.log('Cambiar perfil.');
      } else if (S >= 3.5) {
        console.log('El perfil no es el adecuado.');
      }
    }
    if (F == 27.8) {
      if (S >= 4.4) {
        console.log('Cambiar perfil.');
      } else if (S >= 3.625) {
        console.log('El perfil no es el adecuado.');
      }
    }
    if (F == 34.7) {
      if (S >= 4.55) {
        console.log('Cambiar perfil.');
      } else if (S >= 3.75) {
        console.log('El perfil no es el adecuado.');
      }
    }
    if (F == 43.3) {
      if (S >= 4.7) {
        console.log('Cambiar perfil.');
      } else if (S >= 3.875) {
        console.log('El perfil no es el adecuado.');
      }
    }
    if (F == 53.7) {
      if (S >= 4.85) {
        console.log('Cambiar perfil.');
      } else if (S >= 4.0) {
        console.log('El perfil no es el adecuado.');
      }
    }

    // Calcular N2
    let N2 = 1 + (D_1 - 200) / K;
    console.log('N2: ');
    console.log(N2);

    let Y = 0;
    if (N1 - N2 >= 0) {
      Y = N1;
    } else {
      Y = N2;
    }
    console.log('Y: ');
    console.log(Y);

    return Y;
  }

  metodo2(A, B, C, D, E, F, J, M, N, O, R, V, Z) {
    let n;
    if (C > 230) {
      n = 0.9;
    } else {
      n = 1;
    }

    // Calculo de V
    V =
      (C * 1.15 * F) /
      (Math.sqrt(3) *
        J *
        Math.pow((297.92 * Math.pow(0.885, A / 1000)) / (273.15 + B), n));
    console.log('V: ');
    console.log(V);

    // Calculo de X
    let numeradorDeX = D * Z * (1 + ((A - 1000) / Math.pow(10, 6)) * 125);
    console.log('numeradorDeX: ');
    console.log(numeradorDeX);
    let denominadorDeX =
      (0.961 * R * 297.92 * Math.pow(0.885, A / 1000)) / (273.15 + B);
    console.log('denominadorDeX: ');
    console.log(denominadorDeX);
    let X = numeradorDeX / denominadorDeX;
    console.log('X: ');
    console.log(X);

    // Calculo de W
    let numeradorDeW = E * Z * (1 + ((A - 1000) * 125) / Math.pow(10, 6));
    let denominadorDeW =
      (0.992 * R * 297.92 * Math.pow(0.885, A / 1000)) / (273.15 + B);
    let W = numeradorDeW / denominadorDeW;
    console.log('W: ');
    console.log(W);

    if (V * O > X && V * M > W && V * N > W) {
      return V;
    } else {
      console.log('Aumentar cantidad de aisladores.');
    }
  }

//   private V = this.metodo2(this.A$.getValue(), B, C, D, E, F, J, M, N, O, R, V, Z);

//   private Y = this.metodo1(A, C, F, G, J, L, D_1, K);
}
