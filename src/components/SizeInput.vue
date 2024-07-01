<template>
    <div class="_fd-size-input">
        <template v-if="unit[idx] === 'auto'">
            <n-button :size="size" style="width: 150px;" @click="changeType()">{{ unit[idx] }}</n-button>
        </template>
        <template v-else>
            <n-inputNumber :size="size" v-model="num" @update:value="submit" controls-position="right"/>
            <n-dropdown trigger="click" size="small" :options="options">
                <n-button :size="size">{{ unit[idx] }}</n-button>

            </n-dropdown>
        </template>
    </div>
</template>

<script>
import {defineComponent} from 'vue';
import {isNull} from '../utils/index';

export default defineComponent({
    name: 'SizeInput',
    inject: ['designer'],
    emits: ['update:modelValue', 'change'],
    props: {
        modelValue: String,
        size: String,
        unit: {
            type: Array,
            default: () => ['auto', 'px', '%', 'vh', 'vw', 'em', 'rem']
        },
        defaultUnit: {
            type: String,
            default: 'px'
        }
    },
    watch: {
        modelValue() {
            this.parseValue();
        }
    },
    data() {
        return {
            idx: 1,
            num: 0,
            oldValue: this.modelValue || '',
            options: this.getOptions()
        }
    },
    methods: {
        parseValue() {
            if (this.modelValue !== 'auto') {
                this.idx = Math.max(this.unit.indexOf(this.defaultUnit), 0);
                this.unit.forEach((v, i) => {
                    if ((this.modelValue || '').indexOf(v) > -1) {
                        this.idx = i;
                    }
                });
                this.num = isNull(this.modelValue) ? null : parseFloat(this.modelValue || 0);
            } else {
                this.idx = 0;
                this.num = 0;
            }
        },
        submit() {
            this.oldValue = !isNull(this.num) ? '' + this.num + this.unit[this.idx] : '';
            this.$emit('update:modelValue', this.oldValue);
            this.$emit('change', this.oldValue);
        },
        changeType(idx) {
            if (idx !== undefined) {
                if (this.idx === idx) {
                    return;
                }
                this.idx = idx;
            } else {
                this.idx++;
                if (this.idx > 4) {
                    this.idx = 0;
                }
            }
            if (this.unit[this.idx] === 'auto') {
                this.oldValue = 'auto';
                this.$emit('update:modelValue', 'auto');
                this.$emit('change', 'auto');
            } else {
                this.submit();
            }
        },
      getOptions(){
          let arr =[]
        if(this.unit){
          for(var i in this.unit){
            let name = this.unit[i]
            arr.push({
              label: name,
              key: i,
              props: {
                onClick: () => {
                  this.changeType(i)
                }
              }
            })
          }
        }
          return arr
      }
    },
    created() {
        this.parseValue();
    }

});
</script>

<style>
._fd-size-input {
    display: flex;
    align-items: center;
}

._fd-size-input .el-input-number--small {
    width: 122px;
}

._fd-size-input .el-button {
    font-size: 14px;
    padding: 5px;
    margin-left: 3px;
    width: 25px;
}
</style>
