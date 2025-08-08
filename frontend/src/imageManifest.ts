// Dropbox individual file direct image URLs
const imageUrls: Record<string, string> = {
  'profile1.jpg': 'https://www.dropbox.com/scl/fi/hdepl5mfxpk70pawrqsqg/profile1.jpg?rlkey=xvi1yjz6z0updfiiyq6zvf5is&st=8btwi0em&dl=0',
  'profile2.jpg': 'https://www.dropbox.com/scl/fi/80f0wbpux25up4q4js2ep/profile2.jpg?rlkey=ytp77pt8t0zqju3jzchbel4gl&st=6lrwzi4b&dl=0',
  'profile5.jpg': 'https://www.dropbox.com/scl/fi/7vzlek059ram8j4lezewa/profile5.jpg?rlkey=knfhpj3at3nsxi40qxsca1m5v&st=il0r7evw&dl=0',
  'profile6.jpeg': 'https://www.dropbox.com/scl/fi/snc6lg7htwki78c62m6h5/profile6.jpeg?rlkey=qaic4iqp4kz5perjefwjlrfm0&st=i2gvbjkn&dl=0',
  'profile6.jpg': 'https://www.dropbox.com/scl/fi/t6izkn1cy77bhiksas6dd/profile6.jpg?rlkey=fc8das0tq68vbql95edgr6jxy&st=w174kmdj&dl=0',
  'profile7.jpg': 'https://www.dropbox.com/scl/fi/jnx6w99uryk604ukf9rdk/profile7.jpg?rlkey=o3lj0tsovh12gv5fgma39pan8&st=f1qes45b&dl=0',
  'profile8.jpg': 'https://www.dropbox.com/scl/fi/uzrh6e42o82z4m6k0qcmg/profile8.jpg?rlkey=w38wy0udhzb7gxmcbsif1qmkj&st=dogxlm7y&dl=0',
  'profile9.jpg': 'https://www.dropbox.com/scl/fi/v1093ftz6td7h4xpzjo41/profile9.jpg?rlkey=9ko1jmm24mjs8cetsqk288pj0&st=e53pyiow&dl=0',
  'flair1.jpg': 'https://www.dropbox.com/scl/fi/6csyj9at634kqc5k716an/flair1.jpg?rlkey=cyagvdinwsfej213xt1fnhehk&st=vqk9gvab&dl=0',
  'flair2.png': 'https://www.dropbox.com/scl/fi/onow2fx4n8jwy4i420tdl/flair2.png?rlkey=qyqrkmti628ggqe0l6q2xyhli&st=ca9y8jq9&dl=0',
  'flair3.png': 'https://www.dropbox.com/scl/fi/rjuhsl4x2yqmvobf3lpx9/flair3.png?rlkey=a7buwkspympt4m21jnwhjm5x2&st=imggfkq4&dl=0',
  'flair4.png': 'https://www.dropbox.com/scl/fi/crtk47ynfr7afak506pmy/flair4.png?rlkey=ycsnhh0mywj9cdqow5jbnk1tc&st=esc83ji3&dl=0',
  'nd1.jpg': 'https://www.dropbox.com/scl/fi/67vglonvwv1e5qvpf7h6h/nd1.jpg?rlkey=81phzz7x59ippa0ia4yqwji6t&st=en1s9x1h&dl=0',
  'nd2.png': 'https://www.dropbox.com/scl/fi/jfemmm33sic84i7y33cyj/nd2.png?rlkey=nspjqdpcp7hp0em3un1efwxhd&st=prqko0ya&dl=0',
  'nd3.png': 'https://www.dropbox.com/scl/fi/9wncdesqxd2goropf9rqi/nd3.png?rlkey=c8t8mi3vblrwxgxlfkydqt8aw&st=rolf3dyn&dl=0',
  'nd4.JPG': 'https://www.dropbox.com/scl/fi/l0ae0t1cqaqt7jqeb2q9d/nd4.JPG?rlkey=00grpxr43c7ziz5ddxlxnpvfb&st=77631yqn&dl=0',
  'nd5.jpg': 'https://www.dropbox.com/scl/fi/0btzummjj9blvjba7ztrd/nd5.jpg?rlkey=p3sbt3r9id989og2ao8qu1s5q&st=ndwmfyqo&dl=0',
  'nd6.jpg': 'https://www.dropbox.com/scl/fi/qlkuop4esun0blcnl8azb/nd6.jpg?rlkey=bo7kr63cnz0luzkk5pekz4ogn&st=o7qpaozc&dl=0',
  'politiktok (1).png': 'https://www.dropbox.com/scl/fi/iqxz01xvo00yorkqq5z9j/politiktok-1.png?rlkey=s5moatevodedluvn79o2mfnqb&st=n5dgrji1&dl=0',
  'politiktok (2).png': 'https://www.dropbox.com/scl/fi/4lkkweyp8klkx7uxvddk3/politiktok-2.png?rlkey=162qmhf5ngmucf1z30ran7dxk&st=8ubrbrqk&dl=0',
  'politiktok (3).png': 'https://www.dropbox.com/scl/fi/7cnizu6aei59u1c2v615t/politiktok-3.png?rlkey=e9z2kzt8l5f91rwjqaz86xii3&st=pfeli9pp&dl=0',
  'politiktok (4).png': 'https://www.dropbox.com/scl/fi/ckgvyc996fmbbo3jmet5j/politiktok-4.png?rlkey=y8h1f8oevmtlyfk5i8xgkevax&st=3tzfp0yn&dl=0',
  'politiktok (5).png': 'https://www.dropbox.com/scl/fi/aaxcryvmumfkbkr8sio00/politiktok-5.png?rlkey=q76pjl5b6ar970uk73hpd3vep&st=h3n5ujrz&dl=0',
  'politiktok (6).png': 'https://www.dropbox.com/scl/fi/luvcuc6n2vd4wls4xjqnm/politiktok-6.png?rlkey=e1e5q5l1sh4hi2pb5zrj1xip6&st=v6p6d1gb&dl=0',
  'politiktok (7).png': 'https://www.dropbox.com/scl/fi/wi9u56ylxwhlo8k2zlc4c/politiktok-7.png?rlkey=c4u6iuqjxfngs4q6wh8mwktt0&st=c7vxo5nq&dl=0',
  'politiktok (8).png': 'https://www.dropbox.com/scl/fi/ff3zg1q86egmfazwylksf/politiktok-8.png?rlkey=wh5fk7bb6grhbjs86af31en7s&st=qrdcwh1a&dl=0',
  'politiktok (9).png': 'https://www.dropbox.com/scl/fi/hg8xek8z537w030ru8303/politiktok-9.png?rlkey=vuapdi4r180to865y86z2uvuw&st=ihk71x3k&dl=0',
  'politiktok (10).png': 'https://www.dropbox.com/scl/fi/w9au3ni0dn2ab0lsi4pu8/politiktok-10.png?rlkey=wfu6rsunoree6pb3108zyzrlt&st=mua70hou&dl=0',
  'politiktok (11).png': 'https://www.dropbox.com/scl/fi/4p1d7yvma26w7jjj34zsv/politiktok-11.png?rlkey=pd4fh530rbm8u7dmkex173m5s&st=2noi4joo&dl=0',
  'politiktok (12).png': 'https://www.dropbox.com/scl/fi/spsr5xpi2a40ivof039rd/politiktok-12.png?rlkey=k1wik3sljh4qgmfhvgycqihcr&st=e9xjdpv6&dl=0',
  'ayudante (1).jpg': 'https://www.dropbox.com/scl/fi/220n1pp82obolb8d1dcgl/ayudante-1.jpg?rlkey=d3mwotjht7nwocrd3dvkex059&st=ngkajx02&dl=0',
  'ayudante (2).jpg': 'https://www.dropbox.com/scl/fi/0ub5hwif9rpi1ztfqfoj7/ayudante-2.jpg?rlkey=cbx075usd996fops2mp6wki9v&st=up35rt7a&dl=0',
  'ayudante (3).jpg': 'https://www.dropbox.com/scl/fi/7pvcry44gd8q5v9nlx50a/ayudante-3.jpg?rlkey=c9f32cpcimlsb5pp9ekpi5xqx&st=ssntd81m&dl=0',
  'ayudante (4).jpg': 'https://www.dropbox.com/scl/fi/ioqd61kro7948t18be4su/ayudante-4.jpg?rlkey=8hrlwyh35vqrxs35ldup7i7vo&st=j6roq2o9&dl=0',
  'ayudante (5).jpg': 'https://www.dropbox.com/scl/fi/96q2iz9tax5646ptccdev/ayudante-5.jpg?rlkey=046i8ihp1x5tekd75dsnei4cc&st=bphy6458&dl=0',
  'geoscience (1).png': 'https://www.dropbox.com/scl/fi/8dc870zbrecnuzr8oissr/geoscience-1.png?rlkey=dtcta5qzv9hk9bdylg8xsgkuj&st=6u9cguwq&dl=0',
  'geoscience (2).png': 'https://www.dropbox.com/scl/fi/qodxp4wl136w6aklbeey9/geoscience-2.png?rlkey=6zh8w4370npbol1zza4o8l9ju&st=758awv51&dl=0',
  'geoscience (3).png': 'https://www.dropbox.com/scl/fi/g83y992equd2gu1dx3kb6/geoscience-3.png?rlkey=qkhgvtm03wp165g40wrmuotpf&st=zuw6wzob&dl=0',
  'geoscience (4).png': 'https://www.dropbox.com/scl/fi/aspd9v5g3pljnjra2lrgj/geoscience-4.png?rlkey=h87ynpxpnnbb4hbiw7dlm5b7a&st=v3du67zd&dl=0',
  'geoscience (5).png': 'https://www.dropbox.com/scl/fi/n44686y71rd7gdxq7p6uo/geoscience-5.png?rlkey=fhor6zcm9bt55ssow1ft34pqs&st=8ug8kmhv&dl=0',
  'geoscience (6).png': 'https://www.dropbox.com/scl/fi/8u8uj08ml8uvgrwq2euod/geoscience-6.png?rlkey=8snj66v099vmt86c0j7ohbt4u&st=gxbaguge&dl=0',
  'geoscience (7).png': 'https://www.dropbox.com/scl/fi/dn9f9olbbq029j1q8x9qj/geoscience-7.png?rlkey=8dyur0iioectapd2z8jc5h0gg&st=m1rzjtmx&dl=0',
  'geoscience (8).png': 'https://www.dropbox.com/scl/fi/it6k4qesnfigjrtrmr0eu/geoscience-8.png?rlkey=75ozy05ytkwdlh451hv4nof9q&st=99fyi8gm&dl=0',
  'geoscience (9).png': 'https://www.dropbox.com/scl/fi/a7nnhl30a88mtkgr8oc7v/geoscience-9.png?rlkey=qmnxowcew9dtjiwwe5v5fbti4&st=rs75kcko&dl=0'
}

const toDirectDropbox = (url: string): string => {
  try {
    const u = new URL(url)
    u.host = 'dl.dropboxusercontent.com'
    const params = u.searchParams
    params.delete('raw')
    params.set('dl', '1')
    return u.toString()
  } catch {
    return url
  }
}

// Static image manifest - using external URLs
export const imageManifest = {
  profile: ['profile1.jpg','profile2.jpg','profile5.jpg','profile6.jpeg','profile6.jpg','profile7.jpg','profile8.jpg','profile9.jpg'],
  flair: ['flair1.jpg','flair2.png','flair3.png','flair4.png'],
  nd: ['nd1.jpg','nd2.png','nd3.png','nd4.JPG','nd5.jpg','nd6.jpg'],
  politiktok: ['politiktok (1).png','politiktok (2).png','politiktok (3).png','politiktok (4).png','politiktok (5).png','politiktok (6).png','politiktok (7).png','politiktok (8).png','politiktok (9).png','politiktok (10).png','politiktok (11).png','politiktok (12).png'],
  ayudante: ['ayudante (1).jpg','ayudante (2).jpg','ayudante (3).jpg','ayudante (4).jpg','ayudante (5).jpg'],
  geoscience: ['geoscience (1).png','geoscience (2).png','geoscience (3).png','geoscience (4).png','geoscience (5).png','geoscience (6).png','geoscience (7).png','geoscience (8).png','geoscience (9).png']
}

export const getImages = (category: keyof typeof imageManifest) => {
  const images = imageManifest[category] || []
  return images.map(name => ({
    name,
    url: toDirectDropbox(imageUrls[name] || 'https://via.placeholder.com/400x300?text=Image+Not+Found')
  }))
}

export const getShuffledImages = (category: keyof typeof imageManifest) => {
  const images = getImages(category)
  const shuffled = [...images].sort(() => Math.random() - 0.5)
  if (category === 'profile') {
    const profile1 = shuffled.find(img => img.name.toLowerCase() === 'profile1.jpg')
    if (profile1) {
      const others = shuffled.filter(img => img.name.toLowerCase() !== 'profile1.jpg')
      return [profile1, ...others]
    }
  }
  return shuffled
}
