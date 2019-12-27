document.addEventListener('click',()=>{
    import('./a.js').then(({default:func})=>{
        func()
    })
  })
