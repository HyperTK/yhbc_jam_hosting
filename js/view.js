ELEMENT.locale(ELEMENT.lang.ja)
const config = { 
    headers: {  
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    }
}
var app = new Vue({
    el: "#app",
    mounted: function() {
        this.preload();
    },
    data: {
        form: {
            select_wall: '',
            select_grade: '',
            tags: [],
        },
        walls:'',
        grades: '',
        tags: '',
        dialogVisible: false,
        loading: true,
        rules: {

        },
    },
    methods: {
        preload() {
            this.loading = false;
            axios.get(
                //'https://yhbc-jam-api.herokuapp.com/get_formdata',
                'http://127.0.0.1:5000/get_formdata',
                config,
                )
                .then(response => {
                    var res = response.data
                    this.walls = res[0].walls;
                    this.grades = res[0].grades;
                    this.tags = res[0].tags;
                    this.loading = true;
                })
                .catch(error => {
                    console.log(error.response)
                    this.loading = true;
                    const title = 'データロードエラー' 
                    const mes = 'データの読み込みに失敗しました。もう一度トライしてください';
                    const dur = 5000;
                    this.opneErrorNotif(title, mes, dur)
                });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.loading = false;

                axios.get(
                    //'https://yhbc-jam-api.herokuapp.com/create_problem', 
                    'http://127.0.0.1:5000/get_problems',
                    this.$data, 
                    config,
                    )
                    .then(response => {
                        const res = response.data
                        this.id = res.id
                        this.name = res.name
                        this.loading = true;
                        this.registedDialog = true;
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.loading = true;
                        const title = '検索エラー' 
                        const mes = '検索に失敗しました。もう一度やり直してください。\n何度も失敗するようであれば「滝野」まで連絡願います。';
                        const dur = 5000;
                        this.opneErrorNotif(title, mes, dur)
                    });
            } else {
                this.loading = true;
                const title = 'データ送信エラー' 
                const mes = 'データの送信に失敗しました。未入力の項目を確認し、再度トライしてください。';
                const dur = 5000;
                this.opneErrorNotif(title, mes, dur)
                return false;
            }
            });
        },
        resetForm(formName) {
            this.form.select_grade = '';
            this.form.select_wall = '';
            this.form.select_tags = '';
        },
        opneErrorNotif(title, message, duration) {
            this.$notify.error({
                title: title,
                duration: duration,
                message: message
            });
        },
    }
});