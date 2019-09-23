import css from './styles.scss';

module.exports = class extends window.casthub.module {

    /**
     * Initialize the new Module.
     */
    constructor() {
        super();

        // Set the Module HTML using the Template file.
        this.$container.appendChild(this.template());

        /**
         * The Canvas Element for ChartJS.
         *
         * @type {HTMLElement}
         */
        this.$chart = this.$container.querySelector('.viewers-chart__canvas');

        /**
         * The Count display element.
         *
         * @type {HTMLElement}
         */
        this.$count = this.$container.querySelector('.viewers-count__total');

        /**
         * The ChartJS Instance.
         *
         * @type {*}
         */
        this.chart = null;

        /**
         * All of the different viewer count data points.
         *
         * @type {Array}
         */
        this.data = [];

        /**
         * The max. quantity of data points to show.
         *
         * @type {Number}
         */
        this.max = 30;

        // Set the CSS from the external file.
        this.css = css;
    }

    /**
     * Run any asynchronous code when the Module is mounted to DOM.
     *
     * @return {Promise}
     */
    mounted() {
        // Create the Chart.
        const ctx = this.$chart.getContext('2d');
        const axis = {
            gridLines: {
                display: false,
                drawBorder: false,
                drawTicks: false,
            },
            scaleLabel: {
                display: false,
            },
            ticks: {
                display: false,
            },
        };
        this.chart = new window.casthub.libs.chartjs.Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Viewers',
                        data: this.data,
                        pointStyle: '',
                        borderColor: 'transparent',
                        pointBackgroundColor: 'transparent',
                        backgroundColor: 'rgba(31, 186, 237, 0.5)',
                        borderWidth: 0,
                        fill: true,
                    },
                ],
            },
            options: {
                /**
                 * IMPORTANT: These two options are required for ChartJS to
                 * resize when the Module resizes.
                 */
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 500,
                    easing: 'linear',
                },

                legend: {
                    display: false,
                },

                scales: {
                    xAxes: [axis],
                    yAxes: [axis],
                },
            },
        });

        // Listen to resizes.
        window.addEventListener('resize', () => this.chart.resize());

        return super.mounted().then(() => {
            return this.refresh();
        }).then(() => {
            setInterval(() => this.refresh(), 10000);
        });
    }

    /**
     * Fetches fresh data from the Mixer API.
     *
     * @return {Promise}
     */
    refresh() {
        return window.casthub.fetch({
            integration: 'mixer',
            method: 'GET',
            url: 'users/current',
        }).then(({ channel }) => {
            this.viewers = channel.viewersCurrent;
        });
    }

    /**
     * Sets the total viewers for the Stream.
     *
     * @param {Number} count
     */
    set viewers(count) {
        // Update the Chart.
        this.data.push(count);

        if (this.data.length > this.max) {
            this.data.shift();
        }

        if (this.chart.data.labels.length < this.data.length) {
            this.chart.data.labels.push('');
        }

        this.chart.update();

        // Update the counter.
        this.$count.innerText = count;
    }

};
