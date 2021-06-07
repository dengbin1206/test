<template>
  <div>
   
  </div>
</template>

<script>
export default {
  name: "config-color",
  props: ["data"],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        length: null,
      },
    };
  },
  methods: {
    generateRule() {
      const rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) rules.push(this.validator[key]);
      });
      this.data.rules = rules;
    },
  },
  watch: {
    "data.required": function (val) {
      if (val)
        this.validator.required = {
          required: true,
          message: `${this.data.label}必须填写`,
        };
      else this.validator.required = null;

      this.generateRule();
    },
  },
};
</script>
