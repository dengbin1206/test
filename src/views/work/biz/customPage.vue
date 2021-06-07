<template>
    <div>
        <equipMent :nodeAlias='nodeAlias' :dataId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='SBGL_BX_DART'"></equipMent>
        <check :nodeAlias='nodeAlias' :dataId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='SBGL_DJ_DART'"></check>
        <xmbd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_XMBD_DART'" style="padding:20px"></xmbd>
        <quote :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_CPBJ_DART'" style="padding:20px"></quote>
        <htps :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_HTPS_DART'||flowNode=='CRM_HTPS_ALTER_DART'" style="padding:20px"></htps>
        <xsdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_XSDD_ZC_DART'||flowNode=='CRM_XSDD_TP_DART'||flowNode=='CRM_XSDD_BG_DART'||flowNode=='CRM_XSDD_SHDD_DART'" style="padding:20px"></xsdd>
        <fhsq :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_FHSQ_DART'" style="padding:20px"></fhsq>
        <customerAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_KHZ_DART'" style="padding:20px"></customerAdd>
        <customerAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_KHZSJ_CHANGE_DART'" style="padding:20px"></customerAdd>
        <bankBH :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_YHBH_DART'" style="padding:20px"></bankBH>
        <giftAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_LPSQ_DART' &&isPc" style="padding:20px"></giftAdd>
        <giftAddm :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_LPSQ_DART' &&!isPc" style="padding:20px"></giftAddm>
        <applyTqkpAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_WFHKP_DART'" style="padding:20px"></applyTqkpAdd>
        <customerJDAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_KHJD_DART' &&isPc" style="padding:20px"></customerJDAdd>
        <customerJDAddm :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_KHJD_DART' &&!isPc" style="padding:20px"></customerJDAddm>
        <bondAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_TBBZJ_DART'" style="padding:20px"></bondAdd>  
        <PerformanceAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_ZLYBZJ_DART'" style="padding:20px"></PerformanceAdd>
        <zbAdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" v-if="flowNode=='CRM_ZBFWFF_DART' || flowNode=='CRM_ZBFW_DART'" style="padding:20px"></zbAdd>
        <archives :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='BIZ_DAJY_DART'" style="padding:20px"></archives>
        <glzd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='BIZ_GLZD_DART'&&isPc" style="padding:20px"></glzd>
        <glzdM :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='BIZ_GLZD_DART'&&!isPc" style="padding:20px"></glzdM>
        <orderTicket  :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId"   v-if="flowNode=='CRM_CSWT_DART'&&!isPc"></orderTicket>
        <testTicket  :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType'   v-if="flowNode=='CRM_CSWT_DART'&&isPc"></testTicket>
        <gyshgrd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_QUALITY_GFHGRD_DART'" style="padding:20px"></gyshgrd>
        <testm :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_QUALITY_JYD_HG_DART'" style="padding:20px"></testm> 
        <unqualitym :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CRM_QUALITY_JYD_DART'" style="padding:20px"></unqualitym> 
        <pdxx :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_PGD_DART'" style="padding:20px"></pdxx>
        <install :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_AZSQ_DART'" style="padding:20px"></install>
        <debug :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_TSSQ_DART'" style="padding:20px"></debug>
        <wbsq :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_WBSQ_DART'" style="padding:20px"></wbsq>
        <gfcl :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_GFCL_DART'" style="padding:20px"></gfcl>
        <duty :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_ZRRD_DART'" style="padding:20px"></duty>
        <zlfk :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_ZLFK_DART'" style="padding:20px"></zlfk>  
        <shfc :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_FCWX_DART'" style="padding:20px"></shfc>
        <shxsdd :nodeAlias='nodeAlias' :detailId='dataId' :editFlag="editFlag" :proDefId ="proDefId" :nodeCode="nodeCode" :functionId="functionId" :diaType='diaType' v-if="flowNode=='CS_SHXS_DART'" style="padding:20px"></shxsdd>
    </div>
</template>
<script>
import equipMent from './equipment/equipment'
import check from './equipment/check'
import orderTicket from './equipment/orderTicket'
import testTicket from '../../biz/guarantee/components/testTicketAdd'
import xmbd from '../../biz/crm/components/xmbdAdd'
import quote from '../../biz/crm/components/quoteAdd'
import htps from '../../biz/crm/components/htpsAdd'
import xsdd from '../../biz/crm/components/xsddAdd'
import fhsq from '../../biz/crm/components/fhsqAdd'
import customerAdd from '../../biz/crm/components/customerAdd'
import bankBH from "../../biz/crm/components/bankGuaranteeAdd";
import giftAdd from "../../biz/crm/components/giftAdd";
import giftAddm from "../../biz/crm/components/giftAdd_m";
import applyTqkpAdd from "../../biz/crm/components/applyTqkpAdd";
import customerJDAdd from "../../biz/crm/components/customerJDAdd";
import customerJDAddm from '../../biz/crm/components/customerJDAdd_m';
import bondAdd from "../../biz/crm/components/bondAdd";
import PerformanceAdd from "../../biz/crm/components/turnPerformanceAdd";
import zbAdd from "../../biz/crm/components/turnZbAdd";
import archives from "../../biz/officce/components/archivesAdd"
import glzd from "../../biz/officce/components/glzdsqfbAdd"
import glzdM from './equipment/glzdsqfb_m'
import gyshgrd from '../../biz/guarantee/components/gyshgrdAdd';
import testm from '../../quality/testRecord_m';
import unqualitym from '../../quality/unqualified_m';
import pdxx from '../../biz/cs/workOrder_m';
import install from '../../biz/cs/components/installAdd';
import debug from '../../biz/cs/components/debugAdd';
import wbsq from '../../biz/cs/components/maintenanceAdd';
import gfcl from '../../biz/cs/components/supplierAdd';
import duty from '../../biz/cs/components/dutyAdd';
import zlfk from '../../biz/cs/components/zlfkAdd'
import shfc from '../../biz/cs/components/factoryAdd'
import shxsdd from '../../biz/cs/components/shxsddAdd'
export default {
    components: {
        equipMent,
        check,
        orderTicket,
        testTicket,
        xmbd,
        quote,
        htps,
        xsdd,
        fhsq,
        customerAdd,
        bankBH,
        giftAdd,
        giftAddm,
        applyTqkpAdd,
        customerJDAdd,
        customerJDAddm,
        bondAdd,
        PerformanceAdd,
        zbAdd,
        archives,
        glzd,
        glzdM,
        gyshgrd,
        testm,
        unqualitym,
        pdxx,
        install,
        debug,
        wbsq,
        gfcl,
        duty,
        zlfk,
        shfc,
        shxsdd
    },
    props:['flowNode','nodeAlias','dataId','editFlag','proDefId','nodeCode','functionId','diaType'],
    data () {
        return {
            isPc:false
        }
    },
    created () {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.isPc = false;
        } else {
            this.isPc = true;
        }
    }
}
</script>
