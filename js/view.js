ELEMENT.locale(ELEMENT.lang.ja)
const config = { 
    headers: {  
        'Content-Type': 'application/x-www-form-urlencoded',
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
            checked_tags: [],
        },
        walls:'',
        grades: '',
        tags: '',
        count: 0,
        contents: [],
        resultVisible: false,
        dialogVisible: false,
        loading: true,
        rules: {

        },
    },
    components: {
        'carousel': VueCarousel.Carousel,
        'slide': VueCarousel.Slide
    },
    methods: {
        preload() {
            this.loading = false;
            this.contents = "";
            axios.get(
                'https://yhbc-jam-api.herokuapp.com/problem/get_formdata',
                //'http://127.0.0.1:5000/problem/get_formdata',
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
                    const title = 'データロードエラー';
                    const mes = 'データの読み込みに失敗しました。もう一度トライしてください';
                    const dur = 5000;
                    this.opneErrorNotif(title, mes, dur);
                });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.resultVisible = false;
                this.loading = false;
                var params = {
                    params: {
                        wall: this.form.select_wall,
                        grade: this.form.select_grade,
                    }
                }
                // タグ追加
                for (let index = 0; index < this.form.checked_tags.length; index++) {
                    const element = this.form.checked_tags[index];
                    params.params['tags' + (index + 1).toString()] = element;
                }
                axios.get(
                    'https://yhbc-jam-api.herokuapp.com/problem/create_problem', 
                    //'http://127.0.0.1:5000/problem/get_problems', 
                    params,
                    config,
                    )
                    .then(response => {
                        this.contents = response.data
                        this.count = this.contents.length
                        this.resultVisible = true;
                        this.loading = true;
                        const title = '検索結果' 
                        const mes = this.count + ' 件ヒット！';
                        const dur = 2000;
                        this.openSuccessNotif(title, mes, dur)
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
        handleInputConfirm() {
            let inputTag = this.inputTag;
            if (inputTag) {
                var len = this.tags.length;
                this.tags.push({'id':len + 1, 'name': inputTag});
            }
            this.inputVisible = false;
            this.inputTag = '';
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        resetForm(formName) {
            this.form.select_grade = '';
            this.form.select_wall = '';
            this.form.checked_tags =[];
        },
        openSuccessNotif(title, message, duration) {
            this.$notify.success({
                title: title,
                duration: duration,
                message: message
            });
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