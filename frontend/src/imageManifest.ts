// Dropbox individual file direct image URLs
const imageUrls: Record<string, string> = {
  // Profile images
  'profile1.jpg': 'https://www.dropbox.com/scl/fi/67hwumv31nhmc5utluc89/profile1.jpg?rlkey=akl33s4mh1vp8jcd6kje5awdg&raw=1',
  'profile2.jpg': 'https://www.dropbox.com/scl/fi/80f0wbpux25up4q4js2ep/profile2.jpg?rlkey=ytp77pt8t0zqju3jzchbel4gl&raw=1',
  'profile5.jpg': 'https://www.dropbox.com/scl/fi/7vzlek059ram8j4lezewa/profile5.jpg?rlkey=knfhpj3at3nsxi40qxsca1m5v&raw=1',
  'profile6.jpeg': 'https://www.dropbox.com/scl/fi/snc6lg7htwki78c62m6h5/profile6.jpeg?rlkey=qaic4iqp4kz5perjefwjlrfm0&raw=1',
  'profile6.jpg': 'https://www.dropbox.com/scl/fi/orzq1nuu5180ahcwkvpu5/profile6.jpg?rlkey=cqelo4cm28lzedaqbpbua9j6g&raw=1',
  'profile7.jpg': 'https://www.dropbox.com/scl/fi/xvwxkrjldyltol2b52nba/profile7.jpg?rlkey=llvcdmvz4ku6up9cb6ofks8l6&raw=1',
  'profile8.jpg': 'https://www.dropbox.com/scl/fi/1mlh9dylumsx53lj7v143/profile8.jpg?rlkey=cn5jgittvsqm5pgacygdbtxtt&raw=1',
  'profile9.jpg': 'https://www.dropbox.com/scl/fi/yxwb9044ljec1em2i01dd/profile9.jpg?rlkey=a5zu974a0j5ezenusrrk8peym&raw=1',

  // Flair images
  'flair1.jpg': 'https://www.dropbox.com/scl/fi/6csyj9at634kqc5k716an/flair1.jpg?rlkey=cyagvdinwsfej213xt1fnhehk&raw=1',
  'flair2.png': 'https://www.dropbox.com/scl/fi/onow2fx4n8jwy4i420tdl/flair2.png?rlkey=qyqrkmti628ggqe0l6q2xyhli&raw=1',
  'flair3.png': 'https://www.dropbox.com/scl/fi/rjuhsl4x2yqmvobf3lpx9/flair3.png?rlkey=a7buwkspympt4m21jnwhjm5x2&raw=1',
  'flair4.png': 'https://www.dropbox.com/scl/fi/crtk47ynfr7afak506pmy/flair4.png?rlkey=ycsnhh0mywj9cdqow5jbnk1tc&raw=1',

  // ND images
  'nd1.jpg': 'https://www.dropbox.com/scl/fi/fg1ufr7aht1l20nbqv8us/nd1.jpg?rlkey=0gsclmezgc7sz0iqp54qqruyx&raw=1',
  'nd2.png': 'https://www.dropbox.com/scl/fi/bus5303qbd9bz3hc271se/nd2.png?rlkey=m9um1g59kn1jqr781nvb11m0o&raw=1',
  'nd3.png': 'https://www.dropbox.com/scl/fi/9wncdesqxd2goropf9rqi/nd3.png?rlkey=c8t8mi3vblrwxgxlfkydqt8aw&raw=1',
  'nd4.JPG': 'https://www.dropbox.com/scl/fi/5t3ksoseycytondi3fwoo/nd4.JPG?rlkey=6xgiubeop6biyjkpleultcps6&raw=1',
  'nd5.jpg': 'https://www.dropbox.com/scl/fi/3iyjlndzvw0xrjgqltb1h/nd5.jpg?rlkey=mu0agub9tkcpgezr8pr92pqeu&raw=1',
  'nd6.jpg': 'https://www.dropbox.com/scl/fi/qv95fv9a0q59gxgqns7qz/nd6.jpg?rlkey=w9edpl5ig2sgjlaby9ltsttvc&raw=1',

  // Politiktok images
  'politiktok (1).png': 'https://www.dropbox.com/scl/fi/iqxz01xvo00yorkqq5z9j/politiktok-1.png?rlkey=s5moatevodedluvn79o2mfnqb&raw=1',
  'politiktok (2).png': 'https://www.dropbox.com/scl/fi/4lkkweyp8klkx7uxvddk3/politiktok-2.png?rlkey=162qmhf5ngmucf1z30ran7dxk&raw=1',
  'politiktok (3).png': 'https://www.dropbox.com/scl/fi/7cnizu6aei59u1c2v615t/politiktok-3.png?rlkey=e9z2kzt8l5f91rwjqaz86xii3&raw=1',
  'politiktok (4).png': 'https://www.dropbox.com/scl/fi/ckgvyc996fmbbo3jmet5j/politiktok-4.png?rlkey=y8h1f8oevmtlyfk5i8xgkevax&raw=1',
  'politiktok (5).png': 'https://www.dropbox.com/scl/fi/aaxcryvmumfkbkr8sio00/politiktok-5.png?rlkey=q76pjl5b6ar970uk73hpd3vep&raw=1',
  'politiktok (6).png': 'https://www.dropbox.com/scl/fi/luvcuc6n2vd4wls4xjqnm/politiktok-6.png?rlkey=e1e5q5l1sh4hi2pb5zrj1xip6&raw=1',
  'politiktok (7).png': 'https://www.dropbox.com/scl/fi/wi9u56ylxwhlo8k2zlc4c/politiktok-7.png?rlkey=c4u6iuqjxfngs4q6wh8mwktt0&raw=1',
  'politiktok (8).png': 'https://www.dropbox.com/scl/fi/ff3zg1q86egmfazwylksf/politiktok-8.png?rlkey=wh5fk7bb6grhbjs86af31en7s&raw=1',
  'politiktok (9).png': 'https://www.dropbox.com/scl/fi/hg8xek8z537w030ru8303/politiktok-9.png?rlkey=vuapdi4r180to865y86z2uvuw&raw=1',
  'politiktok (10).png': 'https://www.dropbox.com/scl/fi/w9au3ni0dn2ab0lsi4pu8/politiktok-10.png?rlkey=wfu6rsunoree6pb3108zyzrlt&raw=1',
  'politiktok (11).png': 'https://www.dropbox.com/scl/fi/4p1d7yvma26w7jjj34zsv/politiktok-11.png?rlkey=pd4fh530rbm8u7dmkex173m5s&raw=1',
  'politiktok (12).png': 'https://www.dropbox.com/scl/fi/spsr5xpi2a40ivof039rd/politiktok-12.png?rlkey=k1wik3sljh4qgmfhvgycqihcr&raw=1',

  // Ayudante images
  'ayudante (1).jpg': 'https://www.dropbox.com/scl/fi/8au0cotyi17tslokxqxhu/ayudante-1.jpg?rlkey=92ovjqwlqu10duh7kqlyimy27&raw=1',
  'ayudante (2).jpg': 'https://www.dropbox.com/scl/fi/9exiz6502l8tokdap12df/ayudante-2.jpg?rlkey=mukjri4qv7xws4l09zn5nsbjp&raw=1',
  'ayudante (3).jpg': 'https://www.dropbox.com/scl/fi/0pxxqcbod8bwscmkvtwy1/ayudante-3.jpg?rlkey=j7rtntjr3xzqhkp4fv55iba0b&raw=1',
  'ayudante (4).jpg': 'https://www.dropbox.com/scl/fi/sf84rekveg4yg0flx7xa2/ayudante-4.jpg?rlkey=5o03ossbafhzkj5kj0p3ozvf0&raw=1',
  'ayudante (5).jpg': 'https://www.dropbox.com/scl/fi/gseo1p247c0hx21aw01qb/ayudante-5.jpg?rlkey=gn477ox2ww28cobgaqgmqqeye&raw=1',

  // Geoscience images
  'geoscience (1).png': 'https://www.dropbox.com/scl/fi/8dc870zbrecnuzr8oissr/geoscience-1.png?rlkey=dtcta5qzv9hk9bdylg8xsgkuj&raw=1',
  'geoscience (2).png': 'https://www.dropbox.com/scl/fi/fis4z69p8pbhh3u6weuph/geoscience-2.png?rlkey=1jyx2z5v6eqbgstwi1mt88x7r&raw=1',
  'geoscience (3).png': 'https://www.dropbox.com/scl/fi/fhnssqh54zpvgrd77494j/geoscience-3.png?rlkey=pkcvjsfxlkckdikpo55di0efm&raw=1',
  'geoscience (4).png': 'https://www.dropbox.com/scl/fi/aspd9v5g3pljnjra2lrgj/geoscience-4.png?rlkey=h87ynpxpnnbb4hbiw7dlm5b7a&raw=1',
  'geoscience (5).png': 'https://www.dropbox.com/scl/fi/n44686y71rd7gdxq7p6uo/geoscience-5.png?rlkey=fhor6zcm9bt55ssow1ft34pqs&raw=1',
  'geoscience (6).png': 'https://www.dropbox.com/scl/fi/8u8uj08ml8uvgrwq2euod/geoscience-6.png?rlkey=8snj66v099vmt86c0j7ohbt4u&raw=1',
  'geoscience (7).png': 'https://www.dropbox.com/scl/fi/dn9f9olbbq029j1q8x9qj/geoscience-7.png?rlkey=8dyur0iioectapd2z8jc5h0gg&raw=1',
  'geoscience (8).png': 'https://www.dropbox.com/scl/fi/it6k4qesnfigjrtrmr0eu/geoscience-8.png?rlkey=75ozy05ytkwdlh451hv4nof9q&raw=1',
  'geoscience (9).png': 'https://www.dropbox.com/scl/fi/a7nnhl30a88mtkgr8oc7v/geoscience-9.png?rlkey=qmnxowcew9dtjiwwe5v5fbti4&raw=1',
}

// Static image manifest - using external URLs
export const imageManifest = {
  profile: [
    'profile1.jpg',
    'profile2.jpg',
    'profile5.jpg',
    'profile6.jpeg',
    'profile6.jpg',
    'profile7.jpg',
    'profile8.jpg',
    'profile9.jpg'
  ],
  flair: [
    'flair1.jpg',
    'flair2.png',
    'flair3.png',
    'flair4.png'
  ],
  nd: [
    'nd1.jpg',
    'nd2.png',
    'nd3.png',
    'nd4.JPG',
    'nd5.jpg',
    'nd6.jpg'
  ],
  politiktok: [
    'politiktok (1).png',
    'politiktok (2).png',
    'politiktok (3).png',
    'politiktok (4).png',
    'politiktok (5).png',
    'politiktok (6).png',
    'politiktok (7).png',
    'politiktok (8).png',
    'politiktok (9).png',
    'politiktok (10).png',
    'politiktok (11).png',
    'politiktok (12).png'
  ],
  ayudante: [
    'ayudante (1).jpg',
    'ayudante (2).jpg',
    'ayudante (3).jpg',
    'ayudante (4).jpg',
    'ayudante (5).jpg'
  ],
  geoscience: [
    'geoscience (1).png',
    'geoscience (2).png',
    'geoscience (3).png',
    'geoscience (4).png',
    'geoscience (5).png',
    'geoscience (6).png',
    'geoscience (7).png',
    'geoscience (8).png',
    'geoscience (9).png'
  ]
}

export const getImages = (category: keyof typeof imageManifest) => {
  const images = imageManifest[category] || []
  return images.map(name => ({
    name,
    url: imageUrls[name] || 'https://via.placeholder.com/400x300?text=Image+Not+Found'
  }))
}

export const getShuffledImages = (category: keyof typeof imageManifest) => {
  const images = getImages(category)
  const shuffled = [...images].sort(() => Math.random() - 0.5)

  // Ensure profile1.jpg is first for profile category
  if (category === 'profile') {
    const profile1 = shuffled.find(img => img.name.toLowerCase() === 'profile1.jpg')
    if (profile1) {
      const others = shuffled.filter(img => img.name.toLowerCase() !== 'profile1.jpg')
      return [profile1, ...others]
    }
  }

  return shuffled
}
