onRecordEnrich((e) => {
  const user = e.requestInfo().auth
  if (!user) return e.next()

  const isManager = user.getString('role') === 'manager'
  const isOwner = e.record.getString('manager_id') === user.id

  if (!isManager && !isOwner) {
    e.record.set('name', '*** Oculto ***')
    e.record.set('email', '***@***.com')
    e.record.set('phone', '*** Oculto ***')
    e.record.set('observations', '*** Oculto ***')
  }

  return e.next()
}, 'mapeamentos')
