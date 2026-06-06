onRecordValidate((e) => {
  if (e.collection.name !== 'mapeamentos') return e.next()

  const oldObs = e.record.original().getString('observations')
  const newObs = e.record.getString('observations')

  if (oldObs !== newObs) {
    try {
      const authId = e.requestInfo().auth?.id
      if (authId) {
        e.record.set('last_contact_by', authId)
      }
      e.record.set('last_contact_at', new Date().toISOString())
    } catch (_) {}
  }

  e.next()
}, 'mapeamentos')
