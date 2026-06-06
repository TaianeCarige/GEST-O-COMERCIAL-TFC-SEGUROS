migrate(
  (app) => {
    const segmentos = app.findCollectionByNameOrId('segmentos')

    try {
      app.findFirstRecordByData('segmentos', 'name', 'Corporate')
    } catch (_) {
      const s1 = new Record(segmentos)
      s1.set('name', 'Corporate')
      app.save(s1)
    }

    try {
      app.findFirstRecordByData('segmentos', 'name', '1327')
    } catch (_) {
      const s2 = new Record(segmentos)
      s2.set('name', '1327')
      app.save(s2)
    }
  },
  (app) => {
    // Can be left empty for down migration to avoid removing modified data
  },
)
