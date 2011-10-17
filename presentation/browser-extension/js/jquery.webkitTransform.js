/*
 * jQuery webkitTransform
 * Copyright 2010 Chris Healer
 * Released under the MIT and GPL licenses.
 */
 
 //10/16/10:    todo: units, skew, perspective, rotation
 // 		todo: rotation doesn't account for axis
 //
 //10/30/10:	added support for webkitOpacity
 //
 //05/01/11:	finished rotate and skew... perspective is still broken.
 
 // REQUIRES sylvester to be included: http://sylvester.jcoglan.com/#download
 // http://www.w3.org/TR/css3-2d-transforms/
 // http://webkit.org/blog/386/3d-transforms/
 // http://www.gamedev.net/community/forums/topic.asp?topic_id=467665
 // http://en.wikipedia.org/wiki/Rotation_matrix#Axis_and_angle


 //NOTE: transformation function order does matter!
 //transformations are applied as: trks (perspective is skipped)

(function(jQuery){
	// We override the animation for webkitTransform, which is as close as we can get to -webkit-transform until some regex changes
	jQuery.each(['webkitTransform','webkitOpacity'], function(i,attr)
	{
		jQuery.fx.step[attr] = function(fx)
		{	switch(attr)
			{
				case "webkitTransform":
					if ( !fx.wkInit )
					{
						//fx.start = initTransform( fx.elem, attr );			//for when jquery supports the regex that accomodates '-'
						fx.start = initTransform( fx.elem, "-webkit-transform" );
						fx.end = getTransform( fx.end );
						
						if ((fx.start.rotate[0] == 0) && (fx.start.rotate[1] == 0) && (fx.start.rotate[2] == 0)) //axis for rotation may be undefined if no rotation has been applied.  Steal the axis from the other coordinate in this case.
						{	fx.start.rotate[0] = fx.end.rotate[0];
							fx.start.rotate[1] = fx.end.rotate[1];
							fx.start.rotate[2] = fx.end.rotate[2];
							//console.log("swap");
						}
						else if ((fx.end.rotate[0] == 0) && (fx.end.rotate[1] == 0) && (fx.end.rotate[2] == 0))
						{	fx.end.rotate[0] = fx.start.rotate[0];
							fx.end.rotate[1] = fx.start.rotate[1];
							fx.end.rotate[2] = fx.start.rotate[2];
							//console.log("swap2");
						}
						
						fx.wkInit = true;
						
						//console.log(fx.start);
						//console.log(fx.end);
						
						//console.log(dump(fx.end));
					}
					
					var t = {};
		
					for (var i in fx.start)
						t[i] = alerp(fx.start[i],fx.end[i],fx.pos);
					
					//t['translate'] = alerp(fx.start['translate'],fx.end['translate'],fx.pos);
					//t['rotate'] = alerp(fx.start['rotate'],fx.end['rotate'],fx.pos);
					//t['scale'] = alerp(fx.start['scale'],fx.end['scale'],fx.pos);
		
					//fx.elem.style[attr] = webkitString(t);				//for when jquery supports the regex that accomodates '-'
					fx.elem.style["-webkit-transform"] = webkitString(t);
					
					//--or--
					
					//fx.elem.style[attr] = webkitMatrixString(t);
					//fx.elem.style["-"webkit-transform"] = webkitMatrixString(t);
				
					break;
					
				case "webkitOpacity":
					if ( !fx.wkInit )
					{
						//fx.start = parseFloat(jQuery.curCSS( fx.elem, attr ));	//for when jquery supports the regex that accomodates '-'
						fx.start = parseFloat(jQuery.curCSS( fx.elem, "-webkit-opacity" ));
						fx.end = parseFloat(fx.end);
						fx.wkInit = true;
					}
					
					var v = Math.max(Math.min( parseFloat((fx.pos * (fx.end - fx.start)) + fx.start), 1), 0);
					
					//fx.elem.style[attr] = v						//for when jquery supports the regex that accomodates '-'
					fx.elem.style["-webkit-opacity"] = v;
					
					if (v==0)
						fx.elem.style["visibility"] = "hidden";
					
					break;
					
				default:
					console.log("WebkitTransform unsupported attribute: "+attr);
			}
		}
	});
	
	//return css string as individual transforms
	function webkitString(t)
	{
		//applied in the order that unmatrix decomposes into...
		
		var s = "translate3d("+	epsilon(t.translate[0])+"px," +
					epsilon(t.translate[1])+"px," +
					epsilon(t.translate[2])+"px) " +
			"rotate3d("+	epsilon(t.rotate[0])+"," +
					epsilon(t.rotate[1])+"," +
					epsilon(t.rotate[2])+"," +
					epsilon(t.rotate[3])+"rad) " +
			"skew("+	epsilon(t.skew[0])+"rad," +
					epsilon(t.skew[1])+"rad) " +
			"scale3d("+	epsilon(t.scale[0])+"," +
					epsilon(t.scale[1])+"," +
					epsilon(t.scale[2])+") ";


		//console.log(s);
		//console.log(t);
		
		//TODO: perspective
			
		return s;
	}
	
	//..or if we want to be cool and just jam it all into a matrix
	function webkitMatrixString(t)
	{
		//TODO: in this order!
		//http://www.w3.org/TR/css3-2d-transforms/

		var m = Matrix.I(4);
		
		//multiply these:
		//perspective
		//translate
		//rotate
		//skewZ
		//skexY
		//skewX
		//scale
		
		//return "matrix3d("+m.imspect()+");";
	}

	//array linear interpolation of f(from) to t(to) based on p(percent: [0-1])
	function alerp(f,t,p)
	{
		var r = new Array(f.length);
		
		for (var i=0; i<f.length; i++)
			r[i] = 	p*(t[i] - f[i]) + f[i];
		
		return r;
	}

	// Parse transform into t,r,s,p,k
	function getTransform(transform)
	{
		var r = { translate: [0,0,0], rotate: [0,0,0,0], scale: [1,1,1], skew:[0,0,0], perspective:[0,0,0,0] };				//assume identity values if not specified in target animation
		var a;		//attribute
		var l;		//number of parameters needed
		var d;		//default value if fewer are provided
		
		var p = transform.split(' ');
		for (var i=0; i<p.length; i++)
		{
			var t = p[i].split('(');
			if (t.length == 2)
			{
				t[1] = t[1].substr(0,t[1].length-1);					//remove closing ')'
				
				switch(t[0])
				{
					case "translate":
					case "translate3d":	a = "translate";
								l = 3;
								d = 0;			break;

					case "rotate":
					case "rotate3d":
					case "rotation":	a = "rotate";
								l = 4;
								d = 0;			break;		//4 values are required for an Axis,Theta rotation
					
					case "scale":
					case "scale3d":		a = "scale";
								d = 1;			break
					
					case "skew":
					case "skew3d":		a = "skew";
								l = 3;
								d = 0;			break;
					
					case "perspective":	a = "perspective";
								l = 1;
								d = 0;			break;
					
					case "matrix":
					case "matrix3d":	return initTransform(t[1]);
				}
				
				var ta = t[1].split(",");
				
				//if (ta.length != l)
				//	console.log("WARNING: Wrong number of values provided for '"+a+"'.  "+l+" required, default used.");
				
				for (var j=0; j<ta.length; j++)
					ta[j] = ( (ta[j].indexOf("deg") > -1) ? (Math.PI/180) : 1 ) * parseFloat(ta[j]);	//parse angular units into radians
				
				for (var j=ta.length; j<l; j++)
					ta[j] = d;										//fill with defaults if necessary.	
				
				r[a] = ta;
			}
			else
				console.log("WARNING: Parse error on target webkit string: "+p[i]);
		}
		
		//console.log(r);
		
		return r;
	};

	//decompose matrix string into a t,r,s,p,k object
	//depending on the implementation and the transform, reading the css value out of -webkit-transform may return individual properties or a combined matrix.
	//if it's a matrix, we have to decompose it.
	function initTransform(elem, attr)
	{
		var i,j;
		var st = (attr != undefined) ? jQuery.curCSS(elem, attr) : elem;						//for if some crazy person out there is actually animating a matrix instead of the parameters.
		var m = initMatrix(st);
	
		//console.log(st);
		//console.log(m.inspect());
		
		var translate = new Array(3);
//		var rotateXYZ = new Array(3);		//XYZ rotation (pitch yaw roll)
		var rotate = null;			//rotation of Theta about Axis (allocated later)
		var scale = new Array(3);
		var perspective = new Array(4);
		var skew = new Array(3);
	
		//decompose transform matrix into components...
		//http://www.w3.org/TR/css3-2d-transforms/
		//http://tog.acm.org/resources/GraphicsGems/gemsii/unmatrix.c
		
		// Normalize the matrix.
		if (m.elements[3][3] == 0)
			return {translate:[0,0,0],rotate:[0,0,0,0],scale:[1,1,1],perspective:[Number.MAX_VALUE],skew:[0,0,0]};
		m = m.x(1/m.elements[3][3]);
		
		// perspectiveMatrix is used to solve for perspective, but it also provides
		// an easy way to test for singularity of the upper 3x3 component.
		var p = m.dup();
	
		for (i = 0; i < 3; i++)
			p.elements[i][3] = 0;
		p.elements[3][3] = 1;
		//alert(p.inspect());
	
		if (p.determinant() == 0)
			return Matrix.I(4);
	
		// First, isolate perspective.
		var rightHandSide;
		if (m.elements[0][3] != 0 || m.elements[1][3] != 0 || m.elements[2][3] != 0)
		{	// rightHandSide is the right hand side of the equation.
			var rightHandSide = m.col(4);
			
			// Solve the equation by inverting perspectiveMatrix and multiplying
			// rightHandSide by the inverse.
			var inversePerspectiveMatrix = p.inverse();
			var transposedInversePerspectiveMatrix = inversePerspectiveMatrix.transpose();
			//var pV = rightHandSide.x(transposedInversePerspectiveMatrix);
			var pV = transposedInversePerspectiveMatrix.x(rightHandSide);
			
			// Clear the perspective partition
			m.elements[0][3] = m.elements[1][3] = m.elements[2][3] = 0;
			m.elements[3][3] = 1;
			
			perspective[0] = pV.elements[0];
			perspective[1] = pV.elements[1];
			perspective[2] = pV.elements[2];
			perspective[3] = pV.elements[3];
			
			console.log("WARNING: perspective transforms are broken.");
		}
		else
		{
			// No perspective.
			perspective[0] = perspective[1] = perspective[2] = 0;
			perspective[3] = Number.MAX_VALUE;
		}
	
		// Next take care of translation
		translate[0] = m.elements[3][0];	m.elements[3][0] = 0;
		translate[1] = m.elements[3][1];	m.elements[3][1] = 0;
		translate[2] = m.elements[3][2];	m.elements[3][2] = 0;
	
		// Now get scale and shear. 'row' is a 3 element array of 3 component vectors
		var rows = m.minor(1,1,3,3);
		var row = new Array( rows.row(1), rows.row(2), rows.row(3));
	
		// Compute X scale factor and normalize first row.
		scale[0] = row[0].modulus();
		if (scale[0] != 0)	row[0] = row[0].x(1/scale[0]);
	
		// Compute XY shear factor and make 2nd row orthogonal to 1st.
		skew[0] = row[0].dot(row[1]);
		row[1] = combine(row[1], row[0], 1.0, -skew[0]);
	
		// Now, compute Y scale and normalize 2nd row.
		scale[1] = row[1].modulus();
		if (scale[1] != 0)
		{	row[1] = row[1].x(1/scale[1]);
			skew[0] /= scale[1];
		}
	
		// Compute XZ and YZ shears, orthogonalize 3rd row
		skew[1] = row[0].dot(row[2]);
		row[2] = combine(row[2], row[0], 1.0, -skew[1]);
		skew[2] = row[1].dot(row[2]);
		row[2] = combine(row[2], row[1], 1.0, -skew[2]);
	
		// Next, get Z scale and normalize 3rd row.
		scale[2] = row[2].modulus();
		if (scale[2] != 0)
		{	row[2] = row[2].x(1/scale[2]);
			skew[1] /= scale[2];
			skew[2] /= scale[2];
		}
		
		skew[0] = Math.atan(skew[0]);					//need to convert the coefficients into angles
		skew[1] = Math.atan(skew[1]);
		skew[2] = Math.atan(skew[2]);
	
		// At this point, the matrix (in rows) is orthonormal.
		// Check for a coordinate system flip.  If the determinant
		// is -1, then negate the matrix and the scaling factors.
		var pdum3 = row[1].cross(row[2]);
		if (row[0].dot(pdum3) < 0)
			for (i = 0; i < 3; i++)
			{
				scale[i] *= -1;
				row[i] = row[i].x(-1);
			}
	
		// Now, get the rotations out
		
		//XYZ Rotation...
	/*	rotate[1] = Math.asin(-row[0].elements[2]); // * 180 / Math.PI;
		if (Math.cos(rotate[1]) != 0)
		{	rotate[0] = Math.atan2(row[1].elements[2], row[2].elements[2]); // * 180 / Math.PI;
			rotate[2] = Math.atan2(row[0].elements[1], row[0].elements[0]); // * 180 / Math.PI;
		}
		else
		{
			rotate[0] = atan2(-row[2].elements[0], row[1].element[1]); // * 180 / Math.PI;
			rotate[2] = 0;
		}
	*/
	
		//console.log(row);
	
		//theta with unit axis (XYZ)...
		//http://en.wikipedia.org/wiki/Rotation_matrix#Axis_and_angle
		var rax = row[2].elements[1] - row[1].elements[2];
		var ray = row[0].elements[2] - row[2].elements[0];
		var raz = row[1].elements[0] - row[0].elements[1];
		
		var rr = Math.sqrt( rax*rax + ray*ray + raz*raz );
		var rt = row[0].elements[0]+row[1].elements[1]+row[2].elements[2];
		var ra = Math.atan2(rr,rt-1);
		if (rr > 0)
			rotate = [ rax/rr, ray/rr, -raz/rr, ra ];		//from document, but needs to be flipped to work...?
		else
			rotate = [ 0,0,0,0 ];
		
		//if (rt < 0)	console.log("WARNING: trace was negative.  Rotation is probably wrong.");
	
		//console.log("t: "+translate+"\nr: "+rotate+"\ns: "+scale+"\nk: "+skew+"\np: "+perspective);
		
		return { translate: translate, rotate: rotate, scale: scale, skew: skew, perspective: perspective };
		
	// a simpler version
	/*	
		var t,r,s,p,k;
		var bx,by,bz;	//basis vectors
	
		s = [ tm.row(1).modulus(), tm.row(2).modulus(), tm.row(3).modulus() ];
	
		t = [ tm.row(4).e(1), tm.row(4).e(2), tm.row(4).e(3) ];
		
		alert(s);
	
		return {transform:t, rotation:r, scale:s };
	*/
	};
    
    	//parse matrix string into a Matrix object
	function initMatrix(im)
	{
		//console.log(im);
		
		var trx = /translate3d\(.*\)/;
		var mrx = /matrix3d\(.*\)/;
		var m2rx = /matrix\(.*\)/;
		
		if (trx.exec(im))
		{
			//expects "translate3d(0px,0px,0px)"
			var s = im.substring(12,im.length-1);
			var a = s.split(", ");

			var m = $M( [ [1,0,0,0], [0,1,0,0], [0,0,1,0], [parseFloat(a[0]),parseFloat(a[1]),parseFloat(a[2]),1] ] );

			//alert(m.inspect());
			
			return m;
		}
		else if (mrx.exec(im))
		{
			//expects "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1)"
			var s = im.substring(9,im.length-1);
			var a = s.split(", ");

			var m = $M( [ a.slice(0,4), a.slice(4,8), a.slice(8,12), a.slice(12,16) ] );
		
			//alert(m.inspect());
		
			return m;
		}
		else if (m2rx.exec(im))
		{
			//expects "matrix(1, 0, 0, 1, tx, ty)"
			var s = im.substring(7,im.length-1);
			var a = s.split(", ");

			var m = $M( [ [1,0,0,0], [0,1,0,0], [0,0,1,0], [a[4],a[5],0,1] ] );
		
			//console.log(m.inspect());
		
			return m;
		}
		else
			return Matrix.I(4);
	};
	
	//http://www.w3.org/TR/css3-2d-transforms/
	function combine(a,b,ascl,bscl)
	{	var result = new Array(3);
		result[0] = (ascl * a.e(1)) + (bscl * b.e(1));
		result[1] = (ascl * a.e(2)) + (bscl * b.e(2));
		result[2] = (ascl * a.e(3)) + (bscl * b.e(3));
		return $V(result);
	};
	
	function epsilon(e)
	{
		return Math.round(e*1000000)/1000000;
		
		//return e.toPrecision(5);
		
		//return e.toFixed(10);
		
		//if (e==0)	return 0;
		//var s = e/Math.abs(e);
		//return s * Math.min(1000000000, Math.max( .000001, Math.abs(e) ) );
	}
	
})(jQuery);

/*
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */

/*
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Strings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}
*/