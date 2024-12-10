package com.kugring.back.common;

public interface ResponseCode {

  String SUCCESS = "SU";

  String NOT_EXISTED_MENU = "NMN";
  String NOT_EXISTED_USER = "NUS";
  String NOT_EXISTED_ORDER = "NO";
  String NOT_EXISTED_OPTION = "NOP";
  String NOT_EXISTED_MANAGER = "NMG";
  String NOT_EXISTED_ORDER_ITEM = "NOI";
  String NOT_EXISTED_ORDER_STATUS = "NOS";
  String NOT_EXISTED_ORDER_ITEM_OPTION = "NOIO";

  
  String MAIL_FAIL = "MF";
  String ORDER_FAIL = "OF";
  String REFUND_FAIL = "RF";
  String DUPLICATE_ID = "DI";
  String SIGN_IN_FAIL = "SF";
  String ALREADY_OPTION = "AO";
  String PIN_CHECK_FAIL = "PF";
  String DATABASE_ERROR = "DBE";
  String VALIDATION_FAIL = "VF";
  String MENU_PATCH_FAIL = "MPF";
  String MENU_CREATE_FAIL = "MCF";
  String OPTION_PATCH_FAIL = "OPF";
  String POINT_CHARGE_FAIL = "PCF";
  String CERTIFICATION_FAIL = "CF";
  String OPTION_CREATE_FAIL = "OCF";
  String INSUFFICIENT_BALANCE = "IB";
  String ALREADY_POINT_CHARGE = "APC";
  String CANCEL_POINT_CHARGE_FAIL = "CPF";
  String DELETE_POINT_CHARGE_FAIL = "DPF";








}
