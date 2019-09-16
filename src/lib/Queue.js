import Bee from 'bee-queue';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
import redisConfig from '../config/redis';

/**
 * Toda vez que criar um novo Job, preciso popular o vetor com esse JOB
 */

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    /**
     * Várias filas, vários tipos de serviços Background JOB.
     * Cada serviço terá a sua prórpia fila
     * 1 fila para cada backjob
     * Inicializar queueus "Vazio"
     */
    this.queues = {};

    this.init();
  }

  /**
   * Todo trabalho que fica em uma fila é chamado de JOB
   * handle -> É o método que vai processar nosso JOB
   * Criando a fila
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      // 1º Param - será sempre a key de cada job
      // 2º Param - Configurações
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Método para colocar sempre um novo JOB na fila
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Método para processar as filas
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
