import Route from '@ember/routing/route';

export type ArtistsRouteModel = ReturnType<ArtistsRoute['model']>;

export default class ArtistsRoute extends Route {
  model() {
    return [
      {
        id: 'queen',
        name: 'Queen',
        description:
          'Queen are a British rock band formed in London in 1970. Their classic line-up was ' +
          'Freddie Mercury (lead vocals, piano), Brian May (guitar, vocals), Roger Taylor ' +
          '(drums, vocals) and John Deacon (bass). Their earliest works were influenced by ' +
          'progressive rock, hard rock and heavy metal, but the band gradually ventured into ' +
          'more conventional and radio-friendly works by incorporating further styles, such as ' +
          'arena rock and pop rock.',
        discography: [
          {
            id: 'a-night-at-the-opera',
            name: 'A Night At The Opera',
            description:
              'A Night at the Opera is the fourth studio album by the British rock band Queen, ' +
              'released on 21 November 1975 by EMI Records in the United Kingdom and by Elektra ' +
              'Records in the United States. Produced by Roy Thomas Baker and Queen, it ' +
              'was reportedly the most expensive album ever recorded at the time of its release.',
            tracks: [
              { id: '1', name: 'Death on Two Legs (Dedicated to...)', length: '3:43' },
              { id: '2', name: 'Lazing on a Sunday Afternoon', length: '1:08' },
              { id: '3', name: "I'm in Love with My Car", length: '3:05' },
              { id: '4', name: "You're My Best Friend", length: '2:50' },
              { id: '5', name: "'39", length: '3:30' },
              { id: '6', name: 'Sweet Lady', length: '4:01' },
              { id: '7', name: 'Seaside Rendezvous', length: '2:13' },
              { id: '8', name: "The Prophet's Song", length: '8:21' },
              { id: '9', name: 'Love of My Life', length: '3:38' },
              { id: '10', name: 'Good Company', length: '3:26' },
              { id: '11', name: 'Bohemian Rhapsody', length: '5:55' },
              { id: '12', name: 'God Save the Queen (instrumental)', length: '1:11' },
            ],
          },
        ],
      },
    ];
  }
}
