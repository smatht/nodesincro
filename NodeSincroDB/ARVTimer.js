/**
   * Objeto Timer con funciones start, stop, restart, reset.
   * Ejecuta la funcion que se pasa como parametro en el tiempo especificado.
   * @author - Matias G. Sticchi
   * @param {callback} fn - Ejecuta el callback enviado como parametro.
   * @param {integer} t - Especifica el tienmpo del intervalo.
*/
function Timer (fn, t) {
    var timerObj = setInterval(fn, t)

    this.stop = () => {
        if (timerObj) {
            clearInterval(timerObj)
            timerObj = null
        }
        return this
    }

    this.start = () => {
        if (!timerObj) {
            this.stop()
            timerObj = setInterval(fn, t)
        }
        return this
    }
    
    this.restart = () => {
        this.stop()
        this.start()
        return this
    }
    
    this.reset = (newT) => {
        //this.t = newT
        this.stop()
        return this.stop().start()
    }
}

module.exports = {
    Timer
}