import fetch from './lib/data/fetch'

let extensions: Array<string | undefined> = []
let count = 1
let errors = 0

fetch.recipes().then((res) => {
  res.unwrap().forEach((recipe, index) => {
    setTimeout(() => {
      fetch
        .details(recipe.id)
        .then((dets) =>
          dets.unwrap().images.forEach((img) => {
            count++
            const extension: string | undefined = img.url.split('.').pop()

            if (!extensions.includes(extension)) {
              extensions.push(extension)
            }

            console.log(extensions)
            console.log(count)
            console.log(errors)
          })
        )
        .catch((_) => {
          errors++
        })
    }, index * 100)
  })
})
